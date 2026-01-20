const dashboardSelection = {
  addManagerButton: document.querySelector('.add-manager-btn')! as HTMLElement,
  addManagerForm: document.querySelector('.add-manager-form')! as HTMLElement,
  addWarehouseForm: document.querySelector(
    '.add-warehouse-form'
  )! as HTMLElement,
  addWarehouseButton: document.querySelector(
    '.add-warehouse-btn'
  )! as HTMLElement,
  addManagerOptions: document.querySelector('.managers-option')! as HTMLElement,

  lineGraph: document.querySelector('#lineGraph') as HTMLCanvasElement,
  barGraph: document.querySelector('#barGraph') as HTMLCanvasElement,
  pieChart: document.querySelector('#pieChart') as HTMLCanvasElement,
  lineChart: document.querySelector('#lineChart') as HTMLCanvasElement,
  warehouseSelect: document.querySelector(
    '#warehouseSelect'
  ) as HTMLSelectElement,

  toastSection: document.getElementById('toastSection')! as HTMLElement,
  carouselItems: document.getElementById('carouselItems')! as HTMLElement,

  salesInput: document.querySelector('#salesInput')! as HTMLElement,
  purchaseInput: document.querySelector('#purchaseInput')! as HTMLElement,
  inventoryInput: document.querySelector('#inventoryInput')! as HTMLElement,
  purchaseQuantity: document.querySelector('#purchaseQuantity')! as HTMLElement,
  saleQuantity: document.querySelector('#saleQuantity')! as HTMLElement,

  lowStockTable: document.querySelector('#lowStockTableBody')! as HTMLElement,
  cancelledTable: document.querySelector(
    '#cancelledProductsTableBody'
  )! as HTMLElement,
  adjustmentTable: document.querySelector(
    '#adjustedProductsTableBody'
  )! as HTMLElement,

  shipmentInput: document.querySelector('#shipmentInput')! as HTMLElement,

  lowStockTableCard: document.querySelector(
    '.low-stock-table-card'
  )! as HTMLElement,
  adjustmentTableCard: document.querySelector(
    '.adjustment-table-card '
  )! as HTMLElement,
  cancelledTableCard: document.querySelector(
    '.cancelled-table-card'
  )! as HTMLElement,

  recentActivityList: document.querySelector(
    '#recentActivityList'
  )! as HTMLElement,

  topFiveExport: document.querySelector('#exportTop5')! as HTMLElement,
  categoryExport: document.querySelector('#exportCategory')! as HTMLElement,
  transactionsExport: document.querySelector(
    '#exportTransactions'
  )! as HTMLElement,
  chartCard: document.querySelectorAll(
    '.chart-card'
  ) as NodeListOf<HTMLElement>,
  noDashboardBox: document.querySelector('.no-dashboard-box')! as HTMLElement,

  modeRadios: document.querySelectorAll(
    'input[name="mode"]'
  )! as NodeListOf<HTMLInputElement>,
  dateGroup: document.getElementById('dateGroup')! as HTMLElement,
  fromInput: document.getElementById('fromDate') as HTMLInputElement,
  toInput: document.getElementById('toDate') as HTMLInputElement,

  selectedMode: document.querySelector(
    'input[name="mode"]:checked'
  )! as HTMLInputElement,

  weekly: document.getElementById('weekly') as HTMLInputElement,
};

export default dashboardSelection;
