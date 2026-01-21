type TransactionSections = {
  IN: HTMLElement | null;
  OUT: HTMLElement | null;
  TRANSFER: HTMLElement | null;
  ADJUSTMENT: HTMLElement | null;
};

type WarehouseLabels = {
  source: HTMLElement | null;
  destination: HTMLElement | null;
};

type Warehouses = {
  sourceWarehouse: HTMLSelectElement | null;
  destinationWarehouse: HTMLSelectElement | null;
};

type ProductContainers = {
  inProductsContainer: HTMLElement | null;
  outProductsContainer: HTMLElement | null;
  transferProductsContainer: HTMLElement | null;
  adjustProductsContainer: HTMLElement | null;
};

type TransactionButtons = {
  addInProduct: HTMLElement | null;
  addOutProduct: HTMLElement | null;
  addTransferProduct: HTMLElement | null;
};

type TransactionSelectors = {
  form: HTMLFormElement | null;
  toastSection: HTMLElement | null;
  typeSelect: HTMLElement | null;
  sections: TransactionSections;
  warehouseDropdown: HTMLElement | null;
  warehouseLabels: WarehouseLabels;
  warehouses: Warehouses;
  containers: ProductContainers;
  buttons: TransactionButtons;
  addNewProduct: HTMLElement | null;
  submitTransactionBtn: HTMLElement | null;
};

export type { TransactionSelectors };
