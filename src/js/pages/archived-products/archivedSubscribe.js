import { fetchArchivedProducts } from '../../common/api/productApiHelper.js';
import { paginationRenderer } from '../../common/paginationRenderer.js';
import { renderProductGrid } from '../../common/productGridRenderer.js';
import {
  createProductCard,
  showEmptyState,
  showErrorState,
} from '../../common/template/productTemplate.js';
import { openArchivedModal } from './archivedModal.js';
import archivedSelection from './archivedSelector.js';

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
  renderProductGrid({
    container: archivedSelection.productGrid,
    products,
    createCardHTML: createProductCard,
    onViewDetails: openArchivedModal,
    emptyState: showEmptyState,
  });
};

const renderPagination = (totalPages) => {
  paginationRenderer({
    container: archivedSelection.pagination,
    currentPage: state.page,
    totalPages,
    onPageChange: async (page) => {
      state.page = page;
      await loadArchivedProducts();
    },
  });
};

const initSearchControls = () => {

  archivedSelection.searchInput.addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    resetPageAndFetch();
  });

  archivedSelection.categoryFilter.addEventListener('change', (e) => {
    state.category = e.target.value;
    resetPageAndFetch();
  });

  archivedSelection.sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    resetPageAndFetch();
  });
};

const resetPageAndFetch = async () => {
  state.page = 1;
  await loadArchivedProducts();
};
