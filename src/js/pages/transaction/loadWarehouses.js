// js/pages/transaction/loadWarehouses.js
import config from '../../config/config';
import api from '../../api/interceptor';

const sourceWarehouseSelector = document.getElementById('sourceWarehouse');
const destinationWarehouseSelector = document.getElementById(
  'destinationWarehouse'
);
const destinationWarehouseDropdownLabel = document.getElementById(
  'destinationWarehouseDropdownLabel'
);

export async function getWarehouses() {
  try {
    // const userRes = await api.get(`${config.PROFILE_BASE_URL}/me`);
    // const currentUser = userRes.data.data.user;

    const warehouseRes = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/}`
    );

    return warehouseRes.data.data || [];

  } catch (err) {
    console.log(err.message);
    return [];
  }
}

export async function loadWarehouses() {
  try {
    const assignedWarehouses = await getWarehouses();
    if (!assignedWarehouses.length) return;

    sourceWarehouseSelector.innerHTML =
      '<option selected disabled>Select Source Warehouse</option>';
    destinationWarehouseSelector.innerHTML =
      '<option selected disabled>Select Destination Warehouse</option>';

    assignedWarehouses.forEach((w) => {
      sourceWarehouseSelector.innerHTML += `<option value="${w._id}">${w.name}</option>`;
      destinationWarehouseSelector.innerHTML += `<option value="${w._id}">${w.name}</option>`;
    });
  } catch (err) {
    console.log(err.message);
  }
}

export async function loadDestinationWarehouse() {
  try {
    destinationWarehouseDropdownLabel.classList.remove('d-none');
    destinationWarehouseSelector.classList.remove('d-none');

    const assignedWarehouses = await getWarehouses();
    if (!assignedWarehouses.length) return;

    const sourceId = sourceWarehouseSelector.value;

    destinationWarehouseSelector.innerHTML =
      '<option selected disabled>Select Destination Warehouse</option>';

    assignedWarehouses.forEach((w) => {
      if (w._id !== sourceId) {
        destinationWarehouseSelector.innerHTML += `<option value="${w._id}">${w.name}</option>`;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}
