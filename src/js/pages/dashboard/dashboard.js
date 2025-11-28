import '../../../scss/styles.scss';
import '../../../scss/dashboard.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import * as XLSX from 'xlsx';

import dashboardSelection from './dashboardSelector';
import { addManagerSubscribe } from './adminSubscribe.js';

import {
  showTopProductsSubscribe,
  showInventoryCategorySubscribe,
  showProductTransactionSubscribe,
  fetchUserAndWarehouses,
  showTransactionStatsSubscribe,
  showLowStockProducts,
} from './dashboardSubscribe.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);

document.addEventListener('DOMContentLoaded', async () => {
  await fetchUserAndWarehouses(dashboardSelection.warehouseSelect);
  const firstWarehouse = dashboardSelection.warehouseSelect.value;
  await showTopProductsSubscribe(firstWarehouse);
  await showInventoryCategorySubscribe(firstWarehouse);
  await showProductTransactionSubscribe(firstWarehouse);
  await showTransactionStatsSubscribe(firstWarehouse);
  await showLowStockProducts(firstWarehouse);
});

dashboardSelection.warehouseSelect.addEventListener('change', async () => {
  const selectedWarehouseId = dashboardSelection.warehouseSelect.value;
  await showTopProductsSubscribe(selectedWarehouseId);
  await showInventoryCategorySubscribe(selectedWarehouseId);
  await showProductTransactionSubscribe(selectedWarehouseId);
  await showTransactionStatsSubscribe(selectedWarehouseId);
  await showLowStockProducts(selectedWarehouseId);
});

document.getElementById('export').addEventListener('click', (event) => {
  const jsonString = event.target.getAttribute('data-json');
  if (!jsonString) {
    return;
  }

  let data;

  try {
    data = JSON.parse(jsonString);
  } catch (err) {
    console.error('Invalid JSON:', err);
    return;
  }
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'exported-data.xlsx';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
