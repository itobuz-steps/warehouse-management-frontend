export const transactionSelectors = {
  form: document.getElementById('transactionForm'),
  toastSection: document.getElementById('toastSection'),

  sections: {
    IN: document.getElementById('inFields'),
    OUT: document.getElementById('outFields'),
    TRANSFER: document.getElementById('transferFields'),
    ADJUSTMENT: document.getElementById('adjustmentFields'),
  },

  warehouses: {
    inDestinationWarehouse: document.getElementById('inDestinationWarehouse'),
    outSourceWarehouse: document.getElementById('outSourceWarehouse'),
    sourceWarehouse: document.getElementById('sourceWarehouse'),
    adjustWarehouseId: document.getElementById('adjustWarehouseId'),
    destinationWarehouse: document.getElementById('destinationWarehouse'),
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
    loadInProducts: document.getElementById('loadInProducts'),
    addInProduct: document.getElementById('addInProduct'),
    loadOutProducts: document.getElementById('loadOutProducts'),
    addOutProduct: document.getElementById('addOutProduct'),
    loadTransferProducts: document.getElementById('loadTransferProducts'),
    addTransferProduct: document.getElementById('addTransferProduct'),
    loadAdjustProducts: document.getElementById('loadAdjustProducts'),
  },
};
