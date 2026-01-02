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
  showRecentTransactions,
  showLowStockProducts,
  loadMostCancelledProducts,
  showTopSellingProductsSubscribe,
} from './dashboardSubscribe.js';
import api from '../../api/interceptor.js';
import config from '../../config/config.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);

document.addEventListener('DOMContentLoaded', async () => {
  console.log(dashboardSelection.warehouseSelect);
  const warehouse = await fetchUserAndWarehouses(
    dashboardSelection.warehouseSelect
  );

  //if user has warehouses assigned.
  if (warehouse) {
    const firstWarehouse = dashboardSelection.warehouseSelect.value;
    await showTopProductsSubscribe(firstWarehouse);
    await showInventoryCategorySubscribe(firstWarehouse);
    await showProductTransactionSubscribe(firstWarehouse);
    await showTransactionStatsSubscribe(firstWarehouse);
    await showLowStockProducts(firstWarehouse);
    await loadMostCancelledProducts(firstWarehouse);
    await showRecentTransactions(firstWarehouse);
    await showTopSellingProductsSubscribe(firstWarehouse);
  }
});

dashboardSelection.warehouseSelect.addEventListener('change', async () => {
  const selectedWarehouseId = dashboardSelection.warehouseSelect.value;
  await showTopProductsSubscribe(selectedWarehouseId);
  await showInventoryCategorySubscribe(selectedWarehouseId);
  await showProductTransactionSubscribe(selectedWarehouseId);
  await showTransactionStatsSubscribe(selectedWarehouseId);
  await showLowStockProducts(selectedWarehouseId);
  await loadMostCancelledProducts(selectedWarehouseId);
  await showRecentTransactions(selectedWarehouseId);
  await showTopSellingProductsSubscribe(selectedWarehouseId);
});

dashboardSelection.topFiveExport.addEventListener('click', async () => {
  try {
    const id = dashboardSelection.warehouseSelect.value;

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
    link.download = 'top-products.xlsx';
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
});

dashboardSelection.categoryExport.addEventListener('click', async () => {
  try {
    const id = dashboardSelection.warehouseSelect.value;

    const result = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-inventory-category-chart-data/${id}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([result.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-category.xlsx';
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
});

dashboardSelection.transactionsExport.addEventListener('click', async () => {
  try {
    const id = dashboardSelection.warehouseSelect.value;

    const result = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-product-transaction-chart-data/${id}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([result.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'weekly-transactions.xlsx';
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
});
