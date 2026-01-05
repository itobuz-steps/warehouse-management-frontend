const dashboardSelection = {
  addManagerButton: document.querySelector('.add-manager-btn'),
  addManagerForm: document.querySelector('.add-manager-form'),
  addWarehouseForm: document.querySelector('.add-warehouse-form'),
  addWarehouseButton: document.querySelector('.add-warehouse-btn'),
  addManagerOptions: document.querySelector('.managers-option'),

  barGraph: document.querySelector('#barGraph'),
  pieChart: document.querySelector('#pieChart'),
  lineChart: document.querySelector('#lineChart'),
  warehouseSelect: document.querySelector('#warehouseSelect'),

  toastSection: document.getElementById('toastSection'),
  carouselItems: document.getElementById('carouselItems'),

  salesInput: document.querySelector('#salesInput'),
  purchaseInput: document.querySelector('#purchaseInput'),
  inventoryInput: document.querySelector('#inventoryInput'),
  purchaseQuantity: document.querySelector('#purchaseQuantity'),
  saleQuantity: document.querySelector('#saleQuantity'),

  lowStockTable: document.querySelector('#lowStockTableBody'),
  cancelledTable: document.querySelector('#cancelledProductsTableBody'),
  adjustmentTable: document.querySelector('#adjustedProductsTableBody'),

  shipmentInput: document.querySelector('#shipmentInput'),

  lowStockTableCard: document.querySelector('.low-stock-table-card'),
  adjustmentTableCard: document.querySelector('.adjustment-table-card '),
  cancelledTableCard: document.querySelector('.cancelled-table-card'),

  recentActivityList: document.querySelector('#recentActivityList'),

  topFiveExport: document.querySelector('#exportTop5'),
  categoryExport: document.querySelector('#exportCategory'),
  transactionsExport: document.querySelector('#exportTransactions'),
  chartCard: document.querySelectorAll('.chart-card'),
  noDashboardBox: document.querySelector('.no-dashboard-box'),
};

export default dashboardSelection;
