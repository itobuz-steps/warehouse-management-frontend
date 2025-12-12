import { fetchArchivedProducts } from '../../common/api/productApiHelper.js';

import {
  createProductCard,
  showEmptyState,
  showErrorState,
} from '../../common/template/productTemplate.js';

import { openArchivedModal } from './archivedModal.js';

export let archivedList = [];
export let currentPage = 1;
export const perPage = 12;

export const loadArchivedProducts = async () => {
  try {
    const res = await fetchArchivedProducts();
    const products = res.data.data || [];

    if (!products.length) {
      showEmptyState();
      return;
    }

    archivedList = products;
    currentPage = 1;

    renderPaginatedArchived(archivedList);
  } catch (err) {
    console.error(err);
    showErrorState();
  }
};

export const renderPaginatedArchived = (allProducts) => {
  const start = (currentPage - 1) * perPage;
  const pageItems = allProducts.slice(start, start + perPage);

  renderArchived(pageItems);
  renderArchivedPagination(allProducts);
};

export const renderArchived = (items) => {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (!items.length) {
    showEmptyState();
    return;
  }

  items.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = createProductCard(product);
    grid.appendChild(card);
  });

  document.querySelectorAll('#viewDetails').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const product = JSON.parse(e.target.dataset.product);
      openArchivedModal(product);
    });
  });
};

export const renderArchivedPagination = (allProducts) => {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(allProducts.length / perPage);
  if (totalPages <= 1) {
    pagination.style.display = 'none';
    return;
  }

  pagination.style.display = 'flex';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'page-btn active' : 'page-btn';

    btn.addEventListener('click', () => {
      currentPage = i;
      renderPaginatedArchived(allProducts);
      window.scrollTo(0, 0);
    });

    pagination.appendChild(btn);
  }
};
