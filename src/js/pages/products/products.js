import '../../../scss/products.scss';
import api from '../../api/interceptor';
import config from '../../config/config';
import Templates from '../../common/Templates.js';

const displayTemplates = new Templates();
const toastSection = document.getElementById('toastSection');

const productGrid = document.getElementById('productGrid');
const warehouseSelect = document.getElementById('warehouseSelect');
const paginationContainer = document.getElementById('pagination');
const addProductsButton = document.getElementById('addProducts');
const addProductModal = document.getElementById('addProductModal');
const closeModalButton = document.getElementById('closeModal');
const productWarehouseSelect = document.getElementById('productWarehouse');

addProductsButton.addEventListener('click', () => {
  addProductModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
  addProductModal.style.display = 'none';
});

const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('category', document.getElementById('productCategory').value);
  formData.append(
    'description',
    document.getElementById('productDescription').value
  );
  formData.append('price', document.getElementById('productPrice').value);

  const warehouseId = document.getElementById('productWarehouse').value;
  const quantity = document.getElementById('productQuantity').value;
  // const limit = document.getElementById('productLimit').value || 0;

  const productImages = document.getElementById('productImage').files;
  for (let i = 0; i < productImages.length; i++) {
    formData.append('productImage', productImages[i]);
  }

  try {
    const userRes = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const user = userRes.data.data.user;
    formData.append('createdBy', user._id);

    const res = await api.post(`${config.PRODUCT_BASE_URL}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!res.data.success) {
      toastSection.innerHTML = displayTemplates.errorToast(
        'Failed to add product'
      );
      return;
    }

    const productId = res.data.data._id;

    await api.post(`${config.QUANTITY_BASE_URL}/product-quantity`, {
      productId,
      warehouseId,
      quantity,
      // limit,
    });

    toastSection.innerHTML = displayTemplates.successToast(
      'Product & quantity added successfully'
    );

    addProductForm.reset();
    addProductModal.style.display = 'none';

    fetchProducts();
  } catch (err) {
    console.error(err);
    toastSection.innerHTML = displayTemplates.errorToast(
      'An error occurred while adding the product'
    );
  } finally {
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
});

let allProducts = [];
let currentPage = 1;
const productsPerPage = 10; //enter no of products

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

      assignedWarehouses.forEach((warehouse) => {
        const option = document.createElement('option');
        option.value = warehouse._id;
        option.textContent = warehouse.name;
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

      productWarehouseSelect.innerHTML =
        '<option value="">Select Warehouse</option>';

      assignedWarehouses.forEach((wh) => {
        const option = document.createElement('option');
        option.value = wh._id;
        option.textContent = wh.name;
        productWarehouseSelect.appendChild(option);
      });
    } else {
      toastSection.innerHTML = displayTemplates.errorToast('Unknown Role...');
      showEmptyState();
    }
  } catch (err) {
    console.error('Error fetching warehouses:', err);
    showErrorState();
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
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
      product.productImage && product.productImage.length > 0
        ? product.productImage[0]
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
}

function showErrorState() {
  productGrid.classList.add('error');
  productGrid.innerHTML = `<div>Failed to load products. Please try again.</div>`;
  paginationContainer.innerHTML = '';
}

warehouseSelect.addEventListener('change', (e) => {
  const warehouseId = e.target.value;
  fetchProducts(warehouseId);
});

fetchWarehouses();
