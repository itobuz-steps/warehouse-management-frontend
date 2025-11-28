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
