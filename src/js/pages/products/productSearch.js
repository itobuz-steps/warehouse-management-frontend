import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import { fetchProducts, renderPaginatedProducts } from './productSubscribe.js';
import { getCurrentUser } from '../../common/api/HelperApi.js';
import { productSelection } from './productSelector.js';
import { loadWarehouses } from './productWarehouse.js';
import { showToast } from '../../common/template/productTemplate.js';
import {
  resetSearchFilters,
  updateWarehouseVisibility,
} from '../../common/template/productTemplate.js';

let searchQuery = '';
let selectedCategory = '';
let selectedSort = '';

export const initProductSearch = async () => {
  const url = new URL(window.location);
  const filter = url.searchParams.get('filter') || 'products';

  productSelection.filterTypeSelect.value = filter;
  updateWarehouseVisibility(filter);

  let user;

  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error('Failed to fetch current user:', err);
    showToast('error', 'Could not load user data. Please refresh the page.');
    return;
  }

  resetSearchFilters();

  productSelection.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    fetchSearch(user.role, productSelection.warehouseSelect?.value || '');
  });

  productSelection.categoryFilter.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    fetchSearch(user.role, productSelection.warehouseSelect?.value || '');
  });

  productSelection.sortSelect.addEventListener('change', (e) => {
    selectedSort = e.target.value;
    fetchSearch(user.role, productSelection.warehouseSelect?.value || '');
  });

  if (productSelection.warehouseSelect) {
    productSelection.warehouseSelect.addEventListener('change', (e) => {
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

    const url = new URL(window.location);
    const filter = url.searchParams.get('filter');

    const searchApi =
      filter === 'warehouses'
        ? `${config.QUANTITY_BASE_URL}/all-products-having-quantity`
        : config.PRODUCT_BASE_URL;

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
