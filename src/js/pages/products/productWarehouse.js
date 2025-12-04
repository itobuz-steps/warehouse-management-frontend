import { productSelection } from './productSelector.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/HelperApi.js';
import {
  populateWarehouseSelect,
  showEmptyState,
  showToast,
} from '../../common/template/productTemplate.js';
import { fetchProducts } from './productSubscribe.js';
import {
  resetSearchFilters,
  updateWarehouseVisibility,
} from '../../common/template/productTemplate.js';

productSelection.filterTypeSelect.addEventListener('change', async () => {
  const type = productSelection.filterTypeSelect.value;

  updateWarehouseVisibility(type);

  resetSearchFilters();

  const url = new URL(window.location);
  url.searchParams.set('filter', type);
  window.history.replaceState({}, '', url);

  if (type === 'warehouses') {
    await loadWarehouses();
  } else {
    fetchProducts();
  }
});

productSelection.warehouseSelect.addEventListener('change', async (e) => {
  if (productSelection.filterTypeSelect.value !== 'warehouses') {
    return;
  }

  const warehouseId = e.target.value;
  const url = new URL(window.location);

  if (warehouseId) {
    url.searchParams.set('warehouseId', warehouseId);
  } else {
    url.searchParams.delete('warehouseId');
  }

  window.history.replaceState({}, '', url);
  await loadWarehouses();
});

export const loadWarehouses = async () => {
  try {
    const user = await getCurrentUser();
    const warehouses = await getUserWarehouses();

    if (!warehouses.length) {
      productSelection.warehouseSelect.innerHTML = `<option value="">No warehouses assigned</option>`;
      populateWarehouseSelect([], productSelection.warehouseSelect, true);
      showEmptyState();
      return;
    }

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
      productSelection.warehouseSelect.innerHTML = `<option value="">All Warehouses</option>`;
      populateWarehouseSelect(warehouses, productSelection.warehouseSelect, true);
    } else {
      populateWarehouseSelect(warehouses, productSelection.warehouseSelect);

      const params = new URLSearchParams(window.location.search);
      const selectedId = params.get('warehouseId');

      if (!selectedId) {
        const userWarehouse = warehouses[0];
        productSelection.warehouseSelect.value = userWarehouse._id;

        const url = new URL(window.location);
        url.searchParams.set('warehouseId', userWarehouse._id);
        window.history.replaceState({}, '', url);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get('warehouseId');

    if (selectedId) {
      productSelection.warehouseSelect.value = selectedId;
    }

    fetchProducts(productSelection.warehouseSelect.value);
  } catch (err) {
    console.error(err);
    showToast('error', 'Error fetching warehouses');
  }
};
