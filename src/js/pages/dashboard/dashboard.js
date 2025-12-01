import '../../../scss/styles.scss';
import '../../../scss/dashboard.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
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
import api from '../../api/interceptor.js';
import config from '../../config/config.js';

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

dashboardSelection.topFiveExport.addEventListener('click', async (event) => {
  try {
    const id = '690c2b38228835fa4cd40184';

    const result = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-top-products-chart-data/${id}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([result.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'top-products.xlsx'; // correct Excel file name
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
});
