import { getUserWarehouses } from '../../common/api/helperApi';

const sourceWarehouseSelector = document.getElementById(
  'sourceWarehouse'
) as HTMLSelectElement;
const destinationWarehouseSelector = document.getElementById(
  'destinationWarehouse'
) as HTMLSelectElement;
const destinationWarehouseDropdownLabel = document.getElementById(
  'destinationWarehouseDropdownLabel'
) as HTMLElement;

export async function loadWarehouses() {
  try {
    const assignedWarehouses = await getUserWarehouses();
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
    console.log((err as Error).message);
  }
}

export async function loadDestinationWarehouse() {
  try {
    destinationWarehouseDropdownLabel.classList.remove('d-none');
    destinationWarehouseSelector.classList.remove('d-none');

    const assignedWarehouses = await getUserWarehouses();
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
    console.log((err as Error).message);
  }
}
