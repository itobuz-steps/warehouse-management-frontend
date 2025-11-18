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
} from './dashboardSubscribe.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);

showInventoryCategorySubscribe();
showProductTransactionSubscribe();

document.addEventListener('DOMContentLoaded', async () => {
  await fetchUserAndWarehouses();
  const firstWarehouse = dashboardSelection.warehouseSelect.value;
  await showTopProductsSubscribe(firstWarehouse);
});

dashboardSelection.warehouseSelect.addEventListener('change', async () => {
  const selectedWarehouseId = dashboardSelection.warehouseSelect.value;
  await showTopProductsSubscribe(selectedWarehouseId);
});
