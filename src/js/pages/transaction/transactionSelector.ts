import type { TransactionSelectors } from './types/transactionSelector';

export const transactionSelectors: TransactionSelectors = {
  form: document.getElementById('transactionForm') as HTMLFormElement,
  toastSection: document.getElementById('toastSection') as HTMLElement,
  typeSelect: document.getElementById('transactionType') as HTMLSelectElement,

  sections: {
    IN: document.getElementById('inFields') as HTMLElement,
    OUT: document.getElementById('outFields') as HTMLElement,
    TRANSFER: document.getElementById('transferFields') as HTMLElement,
    ADJUSTMENT: document.getElementById('adjustmentFields') as HTMLElement,
  },

  warehouseDropdown: document.getElementById(
    'warehouseDropdown'
  ) as HTMLElement,
  warehouseLabels: {
    source: document.getElementById(
      'sourceWarehouseDropdownLabel'
    ) as HTMLElement,
    destination: document.getElementById(
      'destinationWarehouseDropdownLabel'
    ) as HTMLElement,
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
    inProductsContainer: document.getElementById(
      'inProductsContainer'
    ) as HTMLElement,
    outProductsContainer: document.getElementById(
      'outProductsContainer'
    ) as HTMLElement,
    transferProductsContainer: document.getElementById(
      'transferProductsContainer'
    ) as HTMLElement,
    adjustProductsContainer: document.getElementById(
      'adjustProductsContainer'
    ) as HTMLElement,
  },

  buttons: {
    addInProduct: document.getElementById('addInProduct') as HTMLButtonElement,
    addOutProduct: document.getElementById(
      'addOutProduct'
    ) as HTMLButtonElement,
    addTransferProduct: document.getElementById(
      'addTransferProduct'
    ) as HTMLButtonElement,
  },

  addNewProduct: document.getElementById(
    'addNewProductBtn'
  ) as HTMLButtonElement,
  submitTransactionBtn: document.getElementById(
    'submitTransactionBtn'
  ) as HTMLButtonElement,
};
