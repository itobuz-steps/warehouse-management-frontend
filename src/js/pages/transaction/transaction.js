import api from '../../api/interceptor';
import Templates from '../../common/Templates';
import { transactionSelectors } from './transactionSelector';

document.addEventListener('DOMContentLoaded', () => {
  const {
    typeSelect,
    form,
    toastSection,
    sections,
    warehouses,
    buttons,
    containers,
  } = transactionSelectors;

  const toastMessage = new Templates();
  let lastLoadedProducts = [];

  async function loadWarehouses() {
    const userRes = await api.get('http://localhost:3000/profile/me');
    const currentUser = userRes.data.data.user;

    const warehouseRes = await api.get(
      `http://localhost:3000/warehouse/get-warehouses/${currentUser._id}`
    );

    let assignedWarehouses = [];

    if (currentUser.role === 'admin') {
      assignedWarehouses = warehouseRes.data.data || [];
    } else {
      assignedWarehouses = warehouseRes.data.data?.assignedWarehouses || [];
    }

    assignedWarehouses = assignedWarehouses.map((w) => ({
      id: w._id || w.id,
      name: w.name || 'Unnamed Warehouse',
    }));

    Object.values(warehouses).forEach((select) => {
      if (!select) return;
      select.innerHTML =
        '<option value="">Select Warehouse</option>' +
        assignedWarehouses
          .map((w) => `<option value="${w.id}">${w.name}</option>`)
          .join('');
    });
  }

  // Hide/show sections
  typeSelect.addEventListener('change', () => {
    Object.values(sections).forEach((s) => s.classList.add('hidden'));
    if (sections[typeSelect.value])
      sections[typeSelect.value].classList.remove('hidden');
  });

  // Load products dynamically
  async function loadProducts(warehouseId, containerId) {
    const container = containers[containerId];
    container.innerHTML = '<em>Loading...</em>';
    const token = localStorage.getItem('access_token');
    if (!token) {
      container.innerHTML =
        "<p class='text-danger'>No token found. Please log in first.</p>";
      return;
    }

    try {
      const res = await api.get(
        `http://localhost:3000/quantity/warehouse-specific-products/${warehouseId}`
      );
      const products = res.data?.data || [];
      container.innerHTML = '';
      if (!products.length) {
        container.innerHTML =
          "<p class='text-muted'>No products found for this warehouse.</p>";
        return;
      }
      lastLoadedProducts = products;
      addProductRow(container, products);
    } catch (err) {
      const message = err.response
        ? `Server error (${err.response.status}): ${err.response.data.message || 'Request failed'}`
        : `Network error: ${err.message}`;
      container.innerHTML = `<p class='text-danger'>Error loading products: ${message}</p>`;
    }
  }

  function addProductRow(container, products) {
    const row = document.createElement('div');
    row.className = 'product-row mb-2';
    row.innerHTML = `
      <select class="form-select productSelect mb-1">
        ${products
          .map(
            (p) =>
              `<option value="${p.product._id}">${p.product.name} (Qty: ${p.quantity})</option>`
          )
          .join('')}
      </select>
      <input type="number" class="form-control quantityInput" placeholder="Quantity" />
    `;
    container.appendChild(row);
  }

  // Buttons
  buttons.loadInProducts.onclick = () =>
    loadProducts(
      warehouses.inDestinationWarehouse.value,
      'inProductsContainer'
    );
  buttons.addInProduct.onclick = () =>
    addProductRow(containers.inProductsContainer, lastLoadedProducts);

  buttons.loadOutProducts.onclick = () =>
    loadProducts(warehouses.outSourceWarehouse.value, 'outProductsContainer');
  buttons.addOutProduct.onclick = () =>
    addProductRow(containers.outProductsContainer, lastLoadedProducts);

  buttons.loadTransferProducts.onclick = () =>
    loadProducts(warehouses.sourceWarehouse.value, 'transferProductsContainer');
  buttons.addTransferProduct.onclick = () =>
    addProductRow(containers.transferProductsContainer, lastLoadedProducts);

  buttons.loadAdjustProducts.onclick = () =>
    loadProducts(warehouses.adjustWarehouseId.value, 'adjustProductsContainer');

  // Submit transaction
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = typeSelect.value;
    if (!type) {
      toastSection.innerHTML = toastMessage.errorToast(
        'Please select a transaction type.'
      );
      setTimeout(() => (toastSection.innerHTML = ''), 3000);
      return;
    }

    function collectProducts(containerId) {
      return [...containers[containerId].querySelectorAll('.product-row')].map(
        (r) => ({
          productId: r.querySelector('.productSelect').value,
          quantity: parseInt(
            r.querySelector('.quantityInput').value || '0',
            10
          ),
        })
      );
    }

    let url = '',
      body = {};
    switch (type) {
      case 'IN':
        url = 'http://localhost:3000/transaction/stock-in';
        body = {
          products: collectProducts('inProductsContainer'),
          supplier: document.getElementById('supplier').value,
          destinationWarehouse: warehouses.inDestinationWarehouse.value,
          notes: document.getElementById('inNotes').value,
        };
        break;

      case 'OUT':
        url = 'http://localhost:3000/transaction/stock-out';
        body = {
          products: collectProducts('outProductsContainer'),
          customerName: document.getElementById('customerName').value,
          customerEmail: document.getElementById('customerEmail').value,
          customerPhone: document.getElementById('customerPhone').value,
          customerAddress: document.getElementById('customerAddress').value,
          orderNumber: document.getElementById('orderNumber').value,
          sourceWarehouse: warehouses.outSourceWarehouse.value,
          notes: document.getElementById('outNotes').value,
        };
        break;

      case 'TRANSFER':
        url = 'http://localhost:3000/transaction/transfer';
        body = {
          products: collectProducts('transferProductsContainer'),
          sourceWarehouse: warehouses.sourceWarehouse.value,
          destinationWarehouse: warehouses.destinationWarehouse.value,
          notes: document.getElementById('transferNotes').value,
        };
        break;

      case 'ADJUSTMENT':
        url = 'http://localhost:3000/transaction/adjustment';
        body = {
          products: collectProducts('adjustProductsContainer'),
          reason: document.getElementById('adjustReason').value,
          notes: document.getElementById('adjustNotes').value,
          warehouseId: warehouses.adjustWarehouseId.value,
        };
        break;
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await api.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      toastSection.innerHTML = toastMessage.successToast(
        res.data.message || 'Transaction submitted successfully!'
      );
      setTimeout(() => (toastSection.innerHTML = ''), 3000);

      form.reset();
      lastLoadedProducts = [];
      Object.values(sections).forEach((s) => s.classList.add('hidden'));
      Object.values(containers).forEach((c) => (c.innerHTML = ''));
    } catch (err) {
      const message = err.response
        ? `Error ${err.response.status}: ${err.response.data.message}`
        : `Network error: ${err.message}`;
      toastSection.innerHTML = toastMessage.errorToast(message);
      setTimeout(() => (toastSection.innerHTML = ''), 3000);
    }
  });

  loadWarehouses();
});
