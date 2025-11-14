import {
  fetchAllProducts,
  fetchProductsByWarehouse,
  getCurrentUser,
} from './productApiHelper.js';
import { dom } from './productSelector.js';
import { showEmptyState, showErrorState } from './productTemplate.js';

let allProducts = [];
let currentPage = 1;
const productsPerPage = 12; //as per products

export const fetchProducts = async (warehouseId = '') => {
  try {
    const user = await getCurrentUser();

    if (!warehouseId && user.role === 'manager') {
      showEmptyState('Please select a warehouse to view products.');
      return;
    }

    const res = warehouseId
      ? await fetchProductsByWarehouse(warehouseId)
      : await fetchAllProducts();

    const products = Array.isArray(res.data.data)
      ? res.data.data
      : res.data.data?.data || [];

    if (!products.length) {
      showEmptyState();
      return;
    }

    allProducts = products;
    currentPage = 1;
    renderPaginatedProducts();
  } catch (err) {
    console.error(err);
    showErrorState();
  }
};

const renderPaginatedProducts = () => {
  const start = (currentPage - 1) * productsPerPage;
  const pageItems = allProducts.slice(start, start + productsPerPage);

  renderProducts(pageItems);
  renderPagination();
};

export const renderProducts = (details) => {
  dom.productGrid.className = '';
  dom.productGrid.innerHTML = '';

  if (!details.length) {
    showEmptyState()
    return;
  }

  details.forEach((detail) => {
    const product = detail.product || detail;
    const imgSrc = product.productImage?.[0] ?? '/images/placeholder.png';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" />
      <div class="card-body">
        <h5>${product.name}</h5>
        <p>${product.description || 'No description available.'}</p>
        <div class="info-row">
          <span class="price">$${product.price ?? 'N/A'}</span>
          <span class="category">${product.category ?? 'Not Categorized'}</span>
        </div>
      </div>
    `;
    dom.productGrid.appendChild(card);
  });
};

const renderPagination = () => {
  dom.pagination.innerHTML = '';

  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  if (totalPages <= 1) {
    dom.pagination.style.display = 'none';
    return;
  }

  dom.pagination.style.display = 'flex';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'page-btn active' : 'page-btn';

    btn.addEventListener('click', () => {
      currentPage = i;

      renderPaginatedProducts();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    dom.pagination.appendChild(btn);
  }
};
