import { dom } from './productSelector.js';
import { getCurrentUser, getUserWarehouses } from './productApiHelper.js';
import { showEmptyState, showToast } from './productTemplate.js';
import { fetchProducts } from './productSubscribe.js';

const populateWarehouseSelect = (warehouses, element, firstOptionLabel) => {
  element.innerHTML = `<option value="">${firstOptionLabel}</option>`;
  warehouses.forEach((warehouse) => {
    const option = document.createElement('option');
    option.value = warehouse._id;
    option.textContent = warehouse.name;
    element.appendChild(option);
  });
};

export const loadWarehouses = async () => {
  try {
    const user = await getCurrentUser();
    const warehouses = await getUserWarehouses(user._id);

    if (!warehouses.length) {
      populateWarehouseSelect(
        [],
        dom.warehouseSelect,
        'No warehouses assigned'
      );
      showEmptyState();
      return;
    }

    const isAdmin = user.role === 'admin';

    populateWarehouseSelect(
      warehouses,
      dom.warehouseSelect,
      isAdmin ? 'All Warehouses' : 'Select a warehouse'
    );

    populateWarehouseSelect(
      warehouses,
      dom.productWarehouseSelect,
      'Select Warehouse'
    );

    if (isAdmin) {
      fetchProducts();
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error fetching warehouses');
  }
};
