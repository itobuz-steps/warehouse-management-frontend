import { productSelection } from './productSelector.js';
import { loadWarehouses } from './productWarehouse.js';
import { openProductModal } from './productDetails.js';
import { getCurrentUser } from '../../common/api/HelperApi.js';
import {
  createProductCard,
  showEmptyState,
  showErrorState,
  showToast,
  resetSearchFilters,
  updateWarehouseVisibility,
} from '../../common/template/productTemplate.js';
import {
  fetchAllProducts,
  fetchProductsHavingQuantity,
} from '../../common/api/productApiHelper.js';

const state = {
  page: 1,
  limit: 12,
  search: '',
  category: '',
  sort: '',
  warehouseId: '',
  filter: 'products',
  user: null,
};

let eventsListener = false;

export const initProductLoader = async () => {
  const url = new URL(window.location);

  state.filter = url.searchParams.get('filter') || 'products';
  state.warehouseId = url.searchParams.get('warehouseId') || '';

  productSelection.filterTypeSelect.value = state.filter;
  updateWarehouseVisibility(state.filter);

  try {
    state.user = await getCurrentUser();
  } catch (err) {
    console.error(err);
    showToast('error', 'Could not load user');
    return;
  }

  resetSearchFilters();
  initializeEventListeners();

  if (state.filter === 'warehouses') {
    await loadWarehouses();

    if (!state.warehouseId && productSelection.warehouseSelect.value) {
      state.warehouseId = productSelection.warehouseSelect.value;

      const url = new URL(window.location);
      url.searchParams.set('warehouseId', state.warehouseId);
      window.history.replaceState({}, '', url);
    }
  }

  await loadProducts({ page: 1, warehouseId: state.warehouseId });
};

const initializeEventListeners = () => {
  if (eventsListener) {
    return;
  }
  eventsListener = true;

  // Search input
  productSelection.searchInput.addEventListener('input', (e) => {
    loadProducts({ search: e.target.value.trim(), page: 1 });
  });

  // Category filter
  productSelection.categoryFilter.addEventListener('change', (e) => {
    loadProducts({ category: e.target.value, page: 1 });
  });

  // Sorting
  productSelection.sortSelect.addEventListener('change', (e) => {
    loadProducts({ sort: e.target.value, page: 1 });
  });

  // Warehouse selection
  productSelection.warehouseSelect?.addEventListener('change', (e) => {
    const warehouseId = e.target.value;
    state.warehouseId = warehouseId;

    const url = new URL(window.location);
    warehouseId
      ? url.searchParams.set('warehouseId', warehouseId)
      : url.searchParams.delete('warehouseId');
    window.history.replaceState({}, '', url);

    loadProducts({ warehouseId, page: 1 });
  });

  productSelection.filterTypeSelect.addEventListener('change', async () => {
    state.filter = productSelection.filterTypeSelect.value;
    updateWarehouseVisibility(state.filter);
    resetSearchFilters();

    const url = new URL(window.location);
    url.searchParams.set('filter', state.filter);
    url.searchParams.delete('warehouseId');
    window.history.replaceState({}, '', url);

    state.page = 1;
    state.warehouseId = '';

    if (state.filter === 'warehouses') {
      await loadWarehouses();

      // Sync warehouse for manager or admin
      if (productSelection.warehouseSelect.value) {
        state.warehouseId = productSelection.warehouseSelect.value;
        url.searchParams.set('warehouseId', state.warehouseId);
        window.history.replaceState({}, '', url);
      }
    }

    await loadProducts({ page: 1, warehouseId: state.warehouseId });
  });
};

export const loadProducts = async (overrides = {}) => {
  try {
    Object.assign(state, overrides);

    // Manager must select a warehouse
    if (
      state.user.role === 'manager' &&
      state.filter === 'warehouses' &&
      !state.warehouseId
    ) {
      renderProducts([]);
      renderPagination(0);
      return;
    }

    const params = {
      page: state.page,
      limit: state.limit,
      search: state.search || undefined,
      category: state.category || undefined,
      sort: state.sort || undefined,
      warehouseId: state.warehouseId || undefined,
    };

    let res;

    if (state.filter === 'warehouses') {
      res = await fetchProductsHavingQuantity(params);
    } else {
      res = await fetchAllProducts(params);
    }

    const {
      products = [],
      totalPages = 0,
      currentPage = 1,
    } = res.data.data || {};

    state.page = currentPage;

    renderProducts(products);
    renderPagination(totalPages);
  } catch (err) {
    console.error(err);
    showErrorState();
  }
};

const renderProducts = (details = []) => {
  productSelection.productGrid.innerHTML = '';

  if (!details.length) {
    showEmptyState();
    return;
  }

  details.forEach((detail) => {
    const product = detail.product || detail;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = createProductCard(product);
    productSelection.productGrid.appendChild(card);
  });

  document.querySelectorAll('#viewDetails').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      openProductModal(JSON.parse(e.target.dataset.product));
    });
  });
};

const renderPagination = (totalPages) => {
  productSelection.pagination.innerHTML = '';

  if (totalPages <= 1) {
    productSelection.pagination.style.display = 'none';
    return;
  }

  productSelection.pagination.style.display = 'flex';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === state.page ? 'page-btn active' : 'page-btn';

    btn.addEventListener('click', () => {
      loadProducts({ page: i, warehouseId: state.warehouseId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    productSelection.pagination.appendChild(btn);
  }
};
