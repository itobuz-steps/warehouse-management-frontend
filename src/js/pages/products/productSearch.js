import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import { fetchProducts, renderPaginatedProducts } from './productSubscribe.js';
import { getCurrentUser } from './productApiHelper.js';
import { dom } from './productSelector.js';
import { loadWarehouses } from './productWarehouse.js';
import { showToast } from './productTemplate.js';
import { resetSearchFilters } from './productEvents.js';

let searchQuery = '';
let selectedCategory = '';
let selectedSort = '';

export const initProductSearch = async () => {
  const url = new URL(window.location);
  const filter = url.searchParams.get('filter') || '';

  dom.warehouseSelect.disabled = filter !== 'warehouses';

  Array.from(dom.sortSelect.options).forEach((option) => {
    if (option.value === 'quantity_asc' || option.value === 'quantity_desc') {
      option.style.display = filter === 'warehouses' ? 'block' : 'none';
    }
  });

  let user;

  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error('Failed to fetch current user:', err);
    showToast('error', 'Could not load user data. Please refresh the page.');
    return;
  }

  resetSearchFilters();

  dom.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    fetchSearch(user.role, dom.warehouseSelect?.value || '');
  });

  dom.categoryFilter.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    fetchSearch(user.role, dom.warehouseSelect?.value || '');
  });

  dom.sortSelect.addEventListener('change', (e) => {
    selectedSort = e.target.value;
    fetchSearch(user.role, dom.warehouseSelect?.value || '');
  });

  if (dom.warehouseSelect) {
    dom.warehouseSelect.addEventListener('change', (e) => {
      fetchSearch(user.role, e.target.value);
    });
  }

  if (filter === 'warehouses') {
    await loadWarehouses();
  } else {
    const url = new URL(window.location);

    url.searchParams.delete('warehouseId');

    window.history.replaceState({}, '', url);
    fetchProducts();
  }
};

export const fetchSearch = async (role, warehouseId = '') => {
  try {
    if (role === 'manager' && !warehouseId) {
      renderPaginatedProducts([]);
      return;
    }

    const searchApi = `${config.QUANTITY_BASE_URL}/all-products-having-quantity`;

    const response = await api.get(searchApi, {
      params: {
        search: searchQuery,
        category: selectedCategory,
        sort: selectedSort,
        warehouseId: warehouseId || undefined,
      },
    });

    const products = response.data.data || [];
    renderPaginatedProducts(products);
  } catch (err) {
    console.error(err);
    renderPaginatedProducts([]);
  }
};
