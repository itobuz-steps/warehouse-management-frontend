import { productSelection } from './productSelector.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/helperApi.js';
import {
  populateWarehouseSelect,
  showEmptyState,
  showToast,
} from '../../common/template/productTemplate.js';

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
      populateWarehouseSelect(
        warehouses,
        productSelection.warehouseSelect,
        true
      );
    } else {
      populateWarehouseSelect(warehouses, productSelection.warehouseSelect);

      const params = new URLSearchParams(window.location.search);
      const selectedId = params.get('warehouseId');

      if (!selectedId) {
        const userWarehouse = warehouses[0];
        productSelection.warehouseSelect.value = userWarehouse._id;

        const url = new URL(window.location.toString());
        url.searchParams.set('warehouseId', userWarehouse._id);
        window.history.replaceState({}, '', url);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get('warehouseId');

    if (selectedId) {
      productSelection.warehouseSelect.value = selectedId;
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error fetching warehouses');
  }
};
