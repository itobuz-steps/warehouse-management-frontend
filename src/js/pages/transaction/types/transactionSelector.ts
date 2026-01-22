type TransactionSections = {
  IN: HTMLElement;
  OUT: HTMLElement;
  TRANSFER: HTMLElement;
  ADJUSTMENT: HTMLElement;
};

type WarehouseLabels = {
  source: HTMLElement;
  destination: HTMLElement;
};

type Warehouses = {
  sourceWarehouse: HTMLSelectElement;
  destinationWarehouse: HTMLSelectElement;
};

type ProductContainers = {
  inProductsContainer: HTMLElement;
  outProductsContainer: HTMLElement;
  transferProductsContainer: HTMLElement;
  adjustProductsContainer: HTMLElement;
};

type TransactionButtons = {
  addInProduct: HTMLButtonElement;
  addOutProduct: HTMLButtonElement;
  addTransferProduct: HTMLButtonElement;
};

type TransactionSelectors = {
  form: HTMLFormElement;
  toastSection: HTMLElement;
  typeSelect: HTMLSelectElement;
  sections: TransactionSections;
  warehouseDropdown: HTMLElement;
  warehouseLabels: WarehouseLabels;
  warehouses: Warehouses;
  containers: ProductContainers;
  buttons: TransactionButtons;
  addNewProduct: HTMLButtonElement;
  submitTransactionBtn: HTMLButtonElement;
};

export type { TransactionSelectors };
