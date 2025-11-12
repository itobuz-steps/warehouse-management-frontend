import api from '../../api/interceptor';

const typeSelect = document.getElementById('type');
const sections = {
  IN: document.getElementById('inFields'),
  OUT: document.getElementById('outFields'),
  TRANSFER: document.getElementById('transferFields'),
  ADJUSTMENT: document.getElementById('adjustmentFields'),
};

// Hide/show sections based on selection
typeSelect.addEventListener('change', () => {
  Object.values(sections).forEach((s) => s.classList.add('hidden'));
  if (sections[typeSelect.value])
    sections[typeSelect.value].classList.remove('hidden');
});

// Load products for a specific warehouse
async function loadProducts(warehouseId, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<em>Loading...</em>';

  const token = localStorage.getItem('access_token');
  if (!token) {
    container.innerHTML =
      "<p class='text-danger'>No token found. Please log in first.</p>";
    return;
  }

  try {
    const res = await api.get(
      `http://localhost:3000/quantity/warehouse-specific-products/${warehouseId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );

    const products = res.data;
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
      ? `Server error (${err.response.status}): ${
          err.response.data.message || 'Request failed'
        }`
      : `Network error: ${err.message}`;
    container.innerHTML = `<p class='text-danger'>Error loading products: ${message}</p>`;
  }
}

// Add a product row to the form
function addProductRow(container, products) {
  const row = document.createElement('div');
  row.className = 'product-row';
  row.innerHTML = `
    <select class="form-select productSelect">
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

// Load/add buttons for each transaction type
document.getElementById('loadInProducts').onclick = () =>
  loadProducts(
    document.getElementById('inDestinationWarehouse').value,
    'inProductsContainer'
  );
document.getElementById('addInProduct').onclick = () =>
  addProductRow(
    document.getElementById('inProductsContainer'),
    lastLoadedProducts
  );

document.getElementById('loadOutProducts').onclick = () =>
  loadProducts(
    document.getElementById('outSourceWarehouse').value,
    'outProductsContainer'
  );
document.getElementById('addOutProduct').onclick = () =>
  addProductRow(
    document.getElementById('outProductsContainer'),
    lastLoadedProducts
  );

document.getElementById('loadTransferProducts').onclick = () =>
  loadProducts(
    document.getElementById('sourceWarehouse').value,
    'transferProductsContainer'
  );
document.getElementById('addTransferProduct').onclick = () =>
  addProductRow(
    document.getElementById('transferProductsContainer'),
    lastLoadedProducts
  );

document.getElementById('loadAdjustProducts').onclick = () =>
  loadProducts(
    document.getElementById('adjustWarehouseId').value,
    'adjustProductsContainer'
  );

let lastLoadedProducts = [];

// Submit transaction
document.getElementById('submitBtn').addEventListener('click', async () => {
  const type = typeSelect.value;
  if (!type) return alert('Please select a transaction type.');

  let url = '';
  let body = {};

  // Helper: collect selected products
  function collectProducts(containerId) {
    return [...document.querySelectorAll(`#${containerId} .product-row`)].map(
      (r) => ({
        productId: r.querySelector('.productSelect').value,
        quantity: parseInt(r.querySelector('.quantityInput').value),
      })
    );
  }

  // Build request payload based on type
  switch (type) {
    case 'IN':
      url = 'http://localhost:3000/transaction/stock-in';
      body = {
        products: collectProducts('inProductsContainer'),
        supplier: document.getElementById('supplier').value,
        destinationWarehouse: document.getElementById('inDestinationWarehouse')
          .value,
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
        sourceWarehouse: document.getElementById('outSourceWarehouse').value,
        notes: document.getElementById('outNotes').value,
      };
      break;

    case 'TRANSFER':
      url = 'http://localhost:3000/transaction/transfer';
      body = {
        products: collectProducts('transferProductsContainer'),
        sourceWarehouse: document.getElementById('sourceWarehouse').value,
        destinationWarehouse: document.getElementById('destinationWarehouse')
          .value,
        notes: document.getElementById('transferNotes').value,
      };
      break;

    case 'ADJUSTMENT':
      url = 'http://localhost:3000/transaction/adjustment';
      body = {
        productId: document.querySelector(
          '#adjustProductsContainer .productSelect'
        )?.value,
        warehouseId: document.getElementById('adjustWarehouseId').value,
        quantity: parseInt(
          document.querySelector('#adjustProductsContainer .quantityInput')
            ?.value
        ),
        reason: document.getElementById('adjustReason').value,
        notes: document.getElementById('adjustNotes').value,
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

    document.getElementById('response').textContent = JSON.stringify(
      res.data,
      null,
      2
    );
  } catch (err) {
    const message = err.response
      ? `Error ${err.response.status}: ${err.response.data.message}`
      : `Network error: ${err.message}`;
    document.getElementById('response').textContent = message;
  }
});
