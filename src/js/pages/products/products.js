import '../../../scss/products.scss';
import api from '../../api/interceptor';
import config from '../../config/config';

const productGrid = document.getElementById('productGrid');
const warehouseSelect = document.getElementById('warehouseSelect');

async function fetchWarehouses() {
  try {
    const userRes = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const user = userRes.data.data.user;
    const USER_ID = user._id;
    const ROLE = user.role;

    const url = `${config.WAREHOUSE_BASE_URL}/${USER_ID}`;
    const res = await api.get(url);
    const assignedWarehouses = res.data.data;

    warehouseSelect.innerHTML = '';

    if (ROLE === 'admin') {
      const allOption = document.createElement('option');
      allOption.value = '';
      allOption.textContent = 'All Warehouses';
      warehouseSelect.appendChild(allOption);

      assignedWarehouses.forEach((wh) => {
        const option = document.createElement('option');
        option.value = wh._id;
        option.textContent = wh.name;
        warehouseSelect.appendChild(option);
      });

      fetchProducts();
    }

    else if (ROLE === 'manager') {
      
      if (!assignedWarehouses || assignedWarehouses.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No warehouses assigned';
        warehouseSelect.appendChild(option);
        showEmptyState();
        return;
      }

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select a warehouse';
      warehouseSelect.appendChild(defaultOption);

      assignedWarehouses.forEach((wh) => {
        const option = document.createElement('option');
        option.value = wh._id;
        option.textContent = wh.name;
        warehouseSelect.appendChild(option);
      });
    }

    else {
      console.warn('Unknown role:', ROLE);
      showEmptyState();
    }
  } catch (err) {
    console.error('Error fetching warehouses:', err);
    showErrorState();
  }
}

async function fetchProducts(warehouseId = '') {
  try {
    const userRes = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const user = userRes.data.data.user;
    const ROLE = user.role;

    if (!warehouseId && ROLE === 'manager') {
      showEmptyState('Please select a warehouse to view products.');
      return;
    }

    const url =
      warehouseId
        ? `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
        : config.PRODUCT_BASE_URL;

    const res = await api.get(url);

    const { success, data } = res.data;
    const products = Array.isArray(data) ? data : data?.data || [];

    if (!success || !products || products.length === 0) {
      showEmptyState();
      return;
    }

    renderProducts(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    showErrorState();
  }
}

function renderProducts(details) {
  productGrid.classList.remove('empty', 'error');
  productGrid.innerHTML = '';

  details.forEach((detail) => {
    const product = detail.product || detail;

    const imgSrc =
      detail.productImage && detail.productImage.length > 0
        ? detail.productImage[0]
        : '/images/placeholder.png';

    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" />
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">${product.description || 'No description available.'}</p>
        <div class="info-row">
          <span class="price">$${product.price ?? 'N/A'}</span>
          <span class="category">${product.category ?? 'Not Categorized'}</span>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function showEmptyState() {
  productGrid.classList.add('empty');
  productGrid.innerHTML = `<div>No products found.</div>`;
}

function showErrorState() {
  productGrid.classList.add('error');
  productGrid.innerHTML = `<div>Failed to load products. Please try again.</div>`;
}
warehouseSelect.addEventListener('change', (e) => {
  const warehouseId = e.target.value;
  fetchProducts(warehouseId);
});

fetchWarehouses();
