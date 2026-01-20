import type { TransactionSelectors } from './types/transactionSelector';

export const transactionSelectors: TransactionSelectors = {
  form: document.getElementById('transactionForm') as HTMLFormElement,
  toastSection: document.getElementById('toastSection'),
  typeSelect: document.getElementById('transactionType') as HTMLElement,

  sections: {
    IN: document.getElementById('inFields'),
    OUT: document.getElementById('outFields'),
    TRANSFER: document.getElementById('transferFields'),
    ADJUSTMENT: document.getElementById('adjustmentFields'),
  },

  warehouseDropdown: document.getElementById('warehouseDropdown'),
  warehouseLabels: {
    source: document.getElementById('sourceWarehouseDropdownLabel'),
    destination: document.getElementById('destinationWarehouseDropdownLabel'),
  },

  warehouses: {
    sourceWarehouse: document.getElementById(
      'sourceWarehouse'
    ) as HTMLSelectElement,
    destinationWarehouse: document.getElementById(
      'destinationWarehouse'
    ) as HTMLSelectElement,
  },

  containers: {
    inProductsContainer: document.getElementById('inProductsContainer'),
    outProductsContainer: document.getElementById('outProductsContainer'),
    transferProductsContainer: document.getElementById(
      'transferProductsContainer'
    ),
    adjustProductsContainer: document.getElementById('adjustProductsContainer'),
  },

  buttons: {
    addInProduct: document.getElementById('addInProduct'),
    addOutProduct: document.getElementById('addOutProduct'),
    addTransferProduct: document.getElementById('addTransferProduct'),
  },

  addNewProduct: document.getElementById('addNewProductBtn'),
  submitTransactionBtn: document.getElementById('submitTransactionBtn'),
};
