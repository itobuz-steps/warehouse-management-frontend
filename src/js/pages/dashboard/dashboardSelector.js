const dashboardSelection = {
  dashboardHeader: document.querySelector('.header-actions'),
  addManagerButton: document.querySelector('.add-manager-btn'),
  addManagerForm: document.querySelector('.add-manager-form'),
  addWarehouseForm: document.querySelector('.add-warehouse-form'),
  addWarehouseButton: document.querySelector('.add-warehouse-btn'),
  addManagerOptions: document.querySelector('.managers-option'),

  barGraph: document.querySelector('#barGraph'),
  pieChart: document.querySelector('#pieChart'),
  lineChart: document.querySelector('#lineChart'),
  warehouseSelect: document.querySelector('#warehouseSelect'),

  salesInput: document.querySelector('#salesInput'),
  purchaseInput: document.querySelector('#purchaseInput'),
  inventoryInput: document.querySelector('#inventoryInput'),
  purchaseQuantity: document.querySelector('#purchaseQuantity'),
  saleQuantity: document.querySelector('#saleQuantity'),
  lowStockTable: document.querySelector('#lowStockTableBody'),
  shipmentInput: document.querySelector('#shipmentInput'),
  username: document.querySelector('.user-role'),
  tableCard: document.querySelector('.table-card'),
};

export default dashboardSelection;
