const analyticsSelection = {
  warehouseSelect: document.getElementById(
    'warehouseSelect'
  ) as HTMLSelectElement,
  warehouseOptions: document.querySelectorAll('.warehouse-option'),

  productSelect1: document.getElementById(
    'productSelect1'
  ) as HTMLSelectElement,
  productSelect2: document.getElementById(
    'productSelect2'
  ) as HTMLSelectElement,
  productOptions: document.querySelectorAll('.product-option'),
  productSelectSection: document.querySelectorAll('.product-select'),

  analyticsForm: document.getElementById('analyticsForm'),
  analyticsSubmit: document.getElementById('analyticsSubmit'),

  noDataSection: document.getElementById('noDataFound') as HTMLElement,
  chartGrid: document.getElementById('chartGrid') as HTMLElement,

  lineChart: document.getElementById('lineChart') as HTMLCanvasElement,
  barChart: document.getElementById('barChart') as HTMLCanvasElement,

  transactionExcel: document.getElementById('transactionExcel'),
  quantityExcel: document.getElementById('quantityExcel'),
};

export default analyticsSelection;
