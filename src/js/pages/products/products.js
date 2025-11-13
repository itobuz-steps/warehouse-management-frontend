import '../../../scss/products.scss';
import api from '../../api/interceptor';
import config from '../../config/config';

const productGrid = document.getElementById('productGrid');
const warehouseSelect = document.getElementById('warehouseSelect');

const MANAGER_ID = '69087ddc2cfbbc9a62050369';

async function fetchWarehouses() {
  try {
    const url = `${config.MANAGER_BASE_URL}/${MANAGER_ID}`;

    const res = await api.get(url);
    console.log('Warehouses response:', res.data);

    const { assignedWarehouses } = res.data.data;

    if (!assignedWarehouses || assignedWarehouses.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No warehouses assigned';
      warehouseSelect.appendChild(option);
      return;
    }

    assignedWarehouses.forEach((wh) => {
      const option = document.createElement('option');
      option.value = wh._id;
      option.textContent = wh.name;
      warehouseSelect.appendChild(option);
    });

    fetchProducts();
  } catch (err) {
    console.error('Error fetching warehouses:', err);
  }
}

async function fetchProducts(warehouseId = '') {
  try {
    const url = warehouseId
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
