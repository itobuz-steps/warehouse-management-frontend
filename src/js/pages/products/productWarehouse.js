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

dom.warehouseSelect.addEventListener('change', (e) => {
  const warehouseId = e.target.value;

  const url = new URL(window.location);
  if (warehouseId) {
    url.searchParams.set('warehouseId', warehouseId);
  } else {
    url.searchParams.delete('warehouseId');
  }

  window.history.replaceState({}, '', url);
});

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
