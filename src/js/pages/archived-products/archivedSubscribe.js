import { fetchArchivedProducts } from '../../common/api/productApiHelper.js';
import {
  createProductCard,
  showEmptyState,
  showErrorState,
} from '../../common/template/productTemplate.js';
import { openArchivedModal } from './archivedModal.js';

const state = {
  page: 1,
  limit: 12,
  totalPages: 1,
  search: '',
  category: '',
  sort: '',
};

export const initArchivedController = () => {
  initSearchControls();
  loadArchivedProducts();
};

export const loadArchivedProducts = async () => {
  try {
    const res = await fetchArchivedProducts({
      page: state.page,
      limit: state.limit,
      search: state.search,
      category: state.category,
      sort: state.sort,
    });

    const { products, totalPages, currentPage } = res.data.data;

    state.totalPages = totalPages;
    state.page = currentPage;

    if (!products.length) {
      showEmptyState();
      renderPagination(0);
      return;
    }

    renderProducts(products);
    renderPagination(state.totalPages);
  } catch (err) {
    console.error(err);
    showErrorState();
  }
};

const renderProducts = (products) => {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = createProductCard(product);
    grid.appendChild(card);
  });

  document.querySelectorAll('#viewDetails').forEach((btn) => {
    btn.onclick = (e) => {
      const product = JSON.parse(e.target.dataset.product);
      openArchivedModal(product);
    };
  });
};

const renderPagination = (totalPages) => {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) {
    pagination.style.display = 'none';
    return;
  }

  pagination.style.display = 'flex';

  const current = state.page;

  const createBtn = (label, page, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'page-btn';

    if (disabled) {
      btn.disabled = true;
      btn.classList.add('disabled');
      return btn;
    }

    btn.addEventListener('click', async () => {
      state.page = page;
      await loadArchivedProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return btn;
  };

  pagination.appendChild(createBtn('<<', 1, current === 1));
  pagination.appendChild(createBtn('<', current - 1, current === 1));

  // page info
  const info = document.createElement('span');
  info.className = 'page-info';
  info.textContent = `${current} of ${totalPages}`;
  pagination.appendChild(info);

  pagination.appendChild(createBtn('>', current + 1, current === totalPages));
  pagination.appendChild(createBtn('>>', totalPages, current === totalPages));
};

const initSearchControls = () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');

  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    resetPageAndFetch();
  });

  categoryFilter.addEventListener('change', (e) => {
    state.category = e.target.value;
    resetPageAndFetch();
  });

  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    resetPageAndFetch();
  });
};

const resetPageAndFetch = async () => {
  state.page = 1;
  await loadArchivedProducts();
};
