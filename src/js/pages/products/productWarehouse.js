import { dom } from './productSelector.js';
import { getCurrentUser, getUserWarehouses } from './productApiHelper.js';
import {
  populateWarehouseSelect,
  showEmptyState,
  showToast,
} from './productTemplate.js';
import { fetchProducts } from './productSubscribe.js';
import { resetSearchFilters } from './productEvents.js';

dom.filterTypeSelect.addEventListener('change', async () => {
  const type = dom.filterTypeSelect.value;

  dom.warehouseSelect.disabled = type !== 'warehouses';

  Array.from(dom.sortSelect.options).forEach((option) => {
    if (option.value === 'quantity_asc' || option.value === 'quantity_desc') {
      option.style.display = type === 'warehouses' ? 'block' : 'none';
    }
  });

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

dom.warehouseSelect.addEventListener('change', async (e) => {
  if (dom.filterTypeSelect.value !== 'warehouses') {
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
    const warehouses = await getUserWarehouses(user._id);

    if (!warehouses.length) {
      dom.warehouseSelect.innerHTML = `<option value="">No warehouses assigned</option>`;
      populateWarehouseSelect([], dom.warehouseSelect, true);
      showEmptyState();
      return;
    }

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
      dom.warehouseSelect.innerHTML = `<option value="">All Warehouses</option>`;
      populateWarehouseSelect(warehouses, dom.warehouseSelect, true);
    } else {
      populateWarehouseSelect(warehouses, dom.warehouseSelect);

      const params = new URLSearchParams(window.location.search);
      const selectedId = params.get('warehouseId');

      if (!selectedId) {
        const userWarehouse = warehouses[0];
        dom.warehouseSelect.value = userWarehouse._id;

        const url = new URL(window.location);
        url.searchParams.set('warehouseId', userWarehouse._id);
        window.history.replaceState({}, '', url);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get('warehouseId');

    if (selectedId) {
      dom.warehouseSelect.value = selectedId;
    }

    fetchProducts(dom.warehouseSelect.value);
  } catch (err) {
    console.error(err);
    showToast('error', 'Error fetching warehouses');
  }
};
