import '../../../scss/inventory.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import './viewWarehouseDetails.js';

import { addWarehouseSubscribe, showManagerOptions } from './addWarehouse.js';
import { displayWarehouse } from './displayWarehouse.js';
import { confirmDelete } from './deleteWarehouse.js';

const addWarehouseForm = document.getElementById('addWarehouseForm');
const addWarehouseButton = document.getElementById('addWarehouseBtn');
const deleteWarehouseBtn = document.getElementById('deleteWarehouseBtn');

// add warehouse
addWarehouseForm.addEventListener('submit', addWarehouseSubscribe);
addWarehouseButton.addEventListener('click', showManagerOptions); // Get all managers when Add-Warehouse button triggered

// display warehouse
displayWarehouse();

//delete warehouse
function deleteWarehouse(id) {
  deleteWarehouseBtn.setAttribute('data-id', id);
  deleteWarehouseBtn.addEventListener('click', confirmDelete);
}

window.deleteWarehouse = deleteWarehouse;
