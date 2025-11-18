import {
  loadWarehouses,
  loadDestinationWarehouse,
  getWarehouses,
} from './loadWarehouses.js';
import { displayProducts } from './displayProducts.js';

const transactionTypeSelector = document.getElementById('transactionType');
const warehouseDropdown = document.getElementById('warehouseDropdown');
const transferOption = document.getElementById('transferOption');
const sourceWarehouseDropdownLabel = document.getElementById(
  'sourceWarehouseDropdownLabel'
);
const destinationWarehouseDropdownLabel = document.getElementById(
  'destinationWarehouseDropdownLabel'
);
const sourceWarehouseSelector = document.getElementById('sourceWarehouse');
const destinationWarehouseSelector = document.getElementById(
  'destinationWarehouse'
);

export async function displayTransactionType() {
  try {
    const assignedWarehouses = await getWarehouses();

    if (assignedWarehouses.length < 2) {
      transferOption.setAttribute('disabled', '');
    }
  } catch (err) {
    console.log(err.message);
  }
}

export function displayWarehouseDropdown() {
  warehouseDropdown.classList.remove('d-none');

  sourceWarehouseDropdownLabel.classList.add('d-none');
  destinationWarehouseDropdownLabel.classList.add('d-none');
  sourceWarehouseSelector.classList.add('d-none');
  destinationWarehouseSelector.classList.add('d-none');

  if (transactionTypeSelector.value === 'IN') {
    // stock in -- work with destination warehouse

    destinationWarehouseDropdownLabel.classList.remove('d-none');
    destinationWarehouseSelector.classList.remove('d-none');

    destinationWarehouseSelector.addEventListener('change', () => {
      displayProducts('IN');
    });
  } else if (transactionTypeSelector.value === 'OUT') {
    // stock out -- work with source warehouse

    sourceWarehouseDropdownLabel.classList.remove('d-none');
    sourceWarehouseSelector.classList.remove('d-none');
  } else if (transactionTypeSelector.value === 'ADJUSTMENT') {
    // stock adjustment -- work with source warehouse

    sourceWarehouseDropdownLabel.classList.remove('d-none');
    sourceWarehouseSelector.classList.remove('d-none');
  } else {
    // transfer stock -- use both source and destination warehouse

    sourceWarehouseDropdownLabel.classList.remove('d-none');
    sourceWarehouseSelector.classList.remove('d-none');

    sourceWarehouseSelector.addEventListener(
      'change',
      loadDestinationWarehouse
    );
  }

  loadWarehouses();
}
