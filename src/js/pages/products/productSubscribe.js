import {
  fetchAllProducts,
  fetchProductsByWarehouse,
  fetchProductsHavingQuantity,
} from './productApiHelper.js';
import { openProductModal } from './productDetails.js';
import { dom } from './productSelector.js';
import {
  createProductCard,
  showEmptyState,
  showErrorState,
} from './productTemplate.js';

let allProducts = [];
let currentPage = 1;
const productsPerPage = 8; //as per products

export const fetchProducts = async (warehouseId = '') => {
  try {
    const url = new URL(window.location);
    const filter = url.searchParams.get('filter');

    const res =
      filter === 'warehouses'
        ? warehouseId
          ? await fetchProductsByWarehouse(warehouseId)
          : await fetchProductsHavingQuantity()
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
    renderPaginatedProducts(allProducts);
  } catch (err) {
    console.error(err);
    showErrorState();
  }
};

export const renderPaginatedProducts = (allProducts) => {
  const start = (currentPage - 1) * productsPerPage;
  const pageItems = allProducts.slice(start, start + productsPerPage);

  renderProducts(pageItems);
  renderPagination(allProducts);
};

export const renderProducts = (details) => {
  dom.productGrid.className = '';
  dom.productGrid.innerHTML = '';
  
  if (!details.length) {
    showEmptyState();
    return;
  }

  details.forEach((detail) => {
    const product = detail.product || detail;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = createProductCard(product);
    dom.productGrid.appendChild(card);
  });

  document.querySelectorAll('#viewDetails').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const product = JSON.parse(e.target.dataset.product);
      openProductModal(product);
    });
  });
};

export const renderPagination = (allProducts) => {
  dom.pagination.innerHTML = '';

  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  if (currentPage > totalPages) {
    currentPage = 1;
  }

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

      renderPaginatedProducts(allProducts);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    dom.pagination.appendChild(btn);
  }
};
