import '../../../scss/inventory.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import './viewWarehouseDetails.js';

import { addWarehouseSubscribe, showManagerOptions } from './addWarehouse.js';
import { displayWarehouse } from './displayWarehouse.js';
// import { viewWarehouseDetails } from './viewWarehouseDetails.js';

const addWarehouseForm = document.getElementById('addWarehouseForm');
const addWarehouseButton = document.getElementById('addWarehouseBtn');
// const viewWarehouseBtn = document.getElementById('viewWarehouseBtn');

// add warehouse
addWarehouseForm.addEventListener('submit', addWarehouseSubscribe);
addWarehouseButton.addEventListener('click', showManagerOptions); // Get all managers when Add-Warehouse button triggered

// display warehouse
displayWarehouse();
