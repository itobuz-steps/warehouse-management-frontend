// can't fix this pages error

import '../../../scss/inventory.scss';
// @ts-expect-error bootstrap need to be imported this way
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import { addWarehouseSubscribe, showManagerOptions } from './addWarehouse.js';
import { displayWarehouse } from './displayWarehouse.js';
import { confirmDelete } from './deleteWarehouse.js';
import { updateWarehouse, selectedManagerOptions } from './editWarehouse.js';
import inventorySelection from './inventorySelector.ts';

const displayToast = new Templates();

inventorySelection.addWarehouseForm?.addEventListener(
  'submit',
  addWarehouseSubscribe
);
inventorySelection.addWarehouseButton?.addEventListener(
  'click',
  showManagerOptions
);

// display warehouse
displayWarehouse();

//delete warehouse
function deleteWarehouse(id: string) {
  inventorySelection.deleteWarehouseBtn?.setAttribute('data-id', id);
  inventorySelection.deleteWarehouseBtn?.addEventListener(
    'click',
    confirmDelete
  );
}

//can't fix this
window.deleteWarehouse = deleteWarehouse;

//edit warehouse
async function editWarehouse(warehouseId: string) {
  try {
    inventorySelection.editWarehouseForm?.setAttribute('data-id', warehouseId);

    const warehouseDetails = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/${warehouseId}`
    );
    const warehouse = warehouseDetails.data.data;
    inventorySelection.editWarehouseName.value = warehouse.name;
    inventorySelection.editWarehouseAddress.value = warehouse.address;
    inventorySelection.editWarehouseDescription.value = warehouse.description;
    selectedManagerOptions(warehouse.managerIds);

    inventorySelection.editWarehouseForm?.addEventListener(
      'submit',
      updateWarehouse
    );
  } catch (err) {
    if (err instanceof Error) {
      inventorySelection.toastSection.innerHTML = displayToast.errorToast(
        err.message
      );
    }
  } finally {
    setTimeout(() => {
      inventorySelection.toastSection.innerHTML = '';
    }, 3000);
  }
}

window.editWarehouse = editWarehouse;
