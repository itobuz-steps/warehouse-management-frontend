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
    const userRes = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const currentUser = userRes.data.data.user;

    const warehouseRes = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/${currentUser._id}`
    );

    return warehouseRes.data.data;
  } catch (err) {
    console.log(err.message);
  }
}

export async function loadWarehouses() {
  try {
    const assignedWarehouses = await getWarehouses();

    sourceWarehouseSelector.innerHTML =
      '<option selected disabled>Select Source Warehouse</option>';
    destinationWarehouseSelector.innerHTML =
      '<option selected disabled>Select Destination Warehouse</option>';

    for (let i = 0; i < assignedWarehouses.length; i++) {
      sourceWarehouseSelector.innerHTML += `<option value="${assignedWarehouses[i]._id}">${assignedWarehouses[i].name}</option>`;
      destinationWarehouseSelector.innerHTML += `<option value="${assignedWarehouses[i]._id}">${assignedWarehouses[i].name}</option>`;
    }
  } catch (err) {
    console.log(err.message);
  }
}

export async function loadDestinationWarehouse() {
  try {
    destinationWarehouseDropdownLabel.classList.remove('d-none');
    destinationWarehouseSelector.classList.remove('d-none');

    const assignedWarehouses = await getWarehouses();

    for (let i = 0; i < assignedWarehouses.length; i++) {
      if (assignedWarehouses[i]._id !== sourceWarehouseSelector.value) {
        destinationWarehouseSelector.innerHTML += `<option value="${assignedWarehouses[i]._id}">${assignedWarehouses[i].name}</option>`;
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}
