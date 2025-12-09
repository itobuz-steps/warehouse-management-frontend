const analyticsSelection = {
  warehouseSelect: document.getElementById('warehouseSelect'),
  warehouseOptions: document.querySelectorAll('.warehouse-option'),

  productSelect1: document.getElementById('productSelect1'),
  productSelect2: document.getElementById('productSelect2'),
  productOptions: document.querySelectorAll('.product-option'),
  productSelectSection: document.querySelectorAll('.product-select'),

  analyticsForm: document.getElementById('analyticsForm'),
  analyticsSubmit: document.getElementById('analyticsSubmit'),

  noDataSection: document.getElementById('noDataFound'),
  chartGrid: document.getElementById('chartGrid'),

  lineChart: document.getElementById('lineChart'),
  barChart: document.getElementById('barChart'),
};

export default analyticsSelection;
