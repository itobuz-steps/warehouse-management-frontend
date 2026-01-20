import '../../../scss/inventory.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import { addWarehouseSubscribe, showManagerOptions } from './addWarehouse.js';
import { displayWarehouse } from './displayWarehouse.js';
import { confirmDelete } from './deleteWarehouse.js';
import { updateWarehouse, selectedManagerOptions } from './editWarehouse.js';
import inventorySelection from './inventorySelector.js';

const displayToast = new Templates();

inventorySelection.addWarehouseForm.addEventListener(
  'submit',
  addWarehouseSubscribe
);
inventorySelection.addWarehouseButton.addEventListener(
  'click',
  showManagerOptions
);

// display warehouse
displayWarehouse();

//delete warehouse
function deleteWarehouse(id) {
  inventorySelection.deleteWarehouseBtn.setAttribute('data-id', id);
  inventorySelection.deleteWarehouseBtn.addEventListener(
    'click',
    confirmDelete
  );
}

window.deleteWarehouse = deleteWarehouse;

//edit warehouse
async function editWarehouse(warehouseId) {
  try {
    inventorySelection.editWarehouseForm.setAttribute('data-id', warehouseId);

    const warehouseDetails = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/${warehouseId}`
    );
    const warehouse = warehouseDetails.data.data;
    inventorySelection.editWarehouseName.value = warehouse.name;
    inventorySelection.editWarehouseAddress.value = warehouse.address;
    inventorySelection.editWarehouseDescription.value = warehouse.description;
    selectedManagerOptions(warehouse.managerIds);

    inventorySelection.editWarehouseForm.addEventListener(
      'submit',
      updateWarehouse
    );
  } catch (err) {
    inventorySelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
  } finally {
    setTimeout(() => {
      inventorySelection.toastSection.innerHTML = '';
    }, 3000);
  }
}

window.editWarehouse = editWarehouse;
