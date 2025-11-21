import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import { renderPaginatedProducts } from './productSubscribe.js';
import { getCurrentUser } from './productApiHelper.js';
import { dom } from './productSelector.js';
import { resetSearchFilters } from './productEvents.js';

let searchQuery = '';
let selectedCategory = '';
let selectedSort = '';

export const initProductSearch = async () => {
  const user = await getCurrentUser();

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

  fetchSearch(user.role, dom.warehouseSelect?.value || '');
};

export const fetchSearch = async (role, warehouseId = '') => {
  try {
    if (role === 'manager' && !warehouseId) {
      renderPaginatedProducts([]);
      return;
    }

    const response = await api.get(`${config.PRODUCT_BASE_URL}/search`, {
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
