import { fetchArchivedProducts } from '../../common/api/productApiHelper.js';
import { paginationRenderer } from '../../common/paginationRenderer.ts';
import { renderProductGrid } from '../../common/productGridRenderer.ts';
import {
  createProductCard,
  showEmptyState,
  showErrorState,
} from '../../common/template/productTemplate.ts';

import { openArchivedModal } from './archivedModal.ts';
import archivedSelection from './archivedSelector.js';

import type { Product } from '../../types/product.js';

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

const renderProducts = (products: Product[]) => {
  renderProductGrid({
    container: archivedSelection.productGrid,
    products,
    createCardHTML: createProductCard,
    onViewDetails: openArchivedModal,
    emptyState: showEmptyState,
  });
};

const renderPagination = (totalPages: number) => {
  console.log('pagination pages', totalPages);
  paginationRenderer({
    container: archivedSelection.pagination,
    currentPage: state.page,
    totalPages,
    onPageChange: async (page: number) => {
      state.page = page;
      await loadArchivedProducts();
    },
  });
};

const initSearchControls = () => {
  archivedSelection.searchInput?.addEventListener('input', (e: Event) => {
    if (!(e.currentTarget instanceof HTMLInputElement)) return;
    state.search = e.currentTarget?.value.trim();
    resetPageAndFetch();
  });

  archivedSelection.categoryFilter?.addEventListener('change', (e: Event) => {
    if (!(e.currentTarget instanceof HTMLSelectElement)) return;
    state.category = e.currentTarget?.value;
    resetPageAndFetch();
  });

  archivedSelection.sortSelect?.addEventListener('change', (e: Event) => {
    if (!(e.currentTarget instanceof HTMLSelectElement)) return;
    state.sort = e.currentTarget?.value;
    resetPageAndFetch();
  });
};

const resetPageAndFetch = async () => {
  state.page = 1;
  await loadArchivedProducts();
};
