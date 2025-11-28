// js/src/pages/transaction/displaySelectors.js
import {
  loadWarehouses,
  loadDestinationWarehouse,
  getWarehouses,
} from './loadWarehouses.js';
import { displayProducts } from './displayProducts.js';
import { transactionSelectors } from './transactionSelector';

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

const { sections } = transactionSelectors;

function hideAllSections() {
  Object.values(sections).forEach((s) => s.classList.add('d-none'));
}

function resetWarehouseUI() {
  warehouseDropdown.classList.add('d-none');

  sourceWarehouseDropdownLabel.classList.add('d-none');
  destinationWarehouseDropdownLabel.classList.add('d-none');
  sourceWarehouseSelector.classList.add('d-none');
  destinationWarehouseSelector.classList.add('d-none');

  // avoid stacking listeners
  sourceWarehouseSelector.onchange = null;
  destinationWarehouseSelector.onchange = null;
}

export async function displayTransactionType() {
  try {
    const assignedWarehouses = await getWarehouses();
    if (!assignedWarehouses || assignedWarehouses.length < 2) {
      transferOption.setAttribute('disabled', '');
    } else {
      transferOption.removeAttribute('disabled');
    }
  } catch (err) {
    console.log(err.message);
  }
}

export function displayWarehouseDropdown() {
  const type = transactionTypeSelector.value;

  hideAllSections();
  resetWarehouseUI();

  if (!type) return;

  warehouseDropdown.classList.remove('d-none');

  if (type === 'IN') {
    // Only destination warehouse matters
    destinationWarehouseDropdownLabel.classList.remove('d-none');
    destinationWarehouseSelector.classList.remove('d-none');

    destinationWarehouseSelector.onchange = () => displayProducts('IN');
    sections.IN.classList.remove('d-none');
  } else if (type === 'OUT') {
    // Only source warehouse
    sourceWarehouseDropdownLabel.classList.remove('d-none');
    sourceWarehouseSelector.classList.remove('d-none');

    sourceWarehouseSelector.onchange = () => displayProducts('OUT');
    sections.OUT.classList.remove('d-none');
  } else if (type === 'ADJUSTMENT') {
    // Only source warehouse
    sourceWarehouseDropdownLabel.classList.remove('d-none');
    sourceWarehouseSelector.classList.remove('d-none');

    sourceWarehouseSelector.onchange = () => displayProducts('ADJUSTMENT');
    sections.ADJUSTMENT.classList.remove('d-none');
  } else if (type === 'TRANSFER') {
    // source + destination
    sourceWarehouseDropdownLabel.classList.remove('d-none');
    sourceWarehouseSelector.classList.remove('d-none');

    sourceWarehouseSelector.onchange = async () => {
      await loadDestinationWarehouse();
      await displayProducts('TRANSFER');
    };

    destinationWarehouseDropdownLabel.classList.remove('d-none');
    destinationWarehouseSelector.classList.remove('d-none');

    sections.TRANSFER.classList.remove('d-none');
  }

  // (Re)fill options whenever type changes
  loadWarehouses();
}
