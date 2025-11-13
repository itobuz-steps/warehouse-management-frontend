import '../../../scss/products.scss';
import api from '../../api/interceptor';
import config from '../../config/config';
import Templates from '../../common/Templates.js';

const displayTemplates = new Templates();

const productGrid = document.getElementById('productGrid');
const warehouseSelect = document.getElementById('warehouseSelect');
const paginationContainer = document.getElementById('pagination');

let allProducts = [];
let currentPage = 1;
const productsPerPage = 2; //enter no of products

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
      
    } else if (ROLE === 'manager') {
      
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

    } else {
      displayTemplates.errorToast('Unknown Role...');
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

    allProducts = products;
    currentPage = 1;
    renderPaginatedProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
    showErrorState();
  }
}

function renderPaginatedProducts() {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const pageProducts = allProducts.slice(startIndex, endIndex);

  renderProducts(pageProducts);
  renderPaginationButtons();
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

function renderPaginationButtons() {
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    document.querySelector('.main-content').style.paddingBottom = '0';
    return;
  }

  paginationContainer.style.display = 'flex';
  document.querySelector('.main-content').style.paddingBottom = '70px';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('page-btn');

    if (i === currentPage) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => {
      currentPage = i;
      renderPaginatedProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    paginationContainer.appendChild(button);
  }
}

function showEmptyState(message = 'No products found.') {
  productGrid.classList.add('empty');
  productGrid.innerHTML = `<div>${message}</div>`;
  paginationContainer.innerHTML = '';
  displayTemplates.errorToast(message);
}

function showErrorState() {
  productGrid.classList.add('error');
  productGrid.innerHTML = `<div>Failed to load products. Please try again.</div>`;
  paginationContainer.innerHTML = '';
  displayTemplates.errorToast('Failed to load products.');
}

warehouseSelect.addEventListener('change', (e) => {
  const warehouseId = e.target.value;
  fetchProducts(warehouseId);
});

fetchWarehouses();
