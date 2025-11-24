import '../../../scss/transaction.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import {
  displayWarehouseDropdown,
  displayTransactionType,
} from './displaySelectors.js';

const transactionTypeSelector = document.getElementById('transactionType');

// show sections by transaction type
displayTransactionType();
transactionTypeSelector.addEventListener('change', displayWarehouseDropdown);

// // Load products dynamically
// async function loadProducts(warehouseId, containerId) {
//   const container = containers[containerId];
//   container.innerHTML = '<em>Loading...</em>';
//   const token = localStorage.getItem('access_token');
//   if (!token) {
//     container.innerHTML =
//       "<p class='text-danger'>No token found. Please log in first.</p>";
//     return;
//   }

// Buttons
// buttons.loadInProducts.onclick = () =>
//   loadProducts(
//     warehouses.inDestinationWarehouse.value,
//     'inProductsContainer'
//   );
// buttons.addInProduct.onclick = () =>
//   addProductRow(containers.inProductsContainer, lastLoadedProducts);

// buttons.loadOutProducts.onclick = () =>
//   loadProducts(warehouses.outSourceWarehouse.value, 'outProductsContainer');
// buttons.addOutProduct.onclick = () =>
//   addProductRow(containers.outProductsContainer, lastLoadedProducts);

// buttons.loadTransferProducts.onclick = () =>
//   loadProducts(warehouses.sourceWarehouse.value, 'transferProductsContainer');
// buttons.addTransferProduct.onclick = () =>
//   addProductRow(containers.transferProductsContainer, lastLoadedProducts);

// buttons.loadAdjustProducts.onclick = () =>
//   loadProducts(warehouses.adjustWarehouseId.value, 'adjustProductsContainer');

// // Submit transaction
// form.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const type = typeSelect.value;
//   if (!type) {
//     toastSection.innerHTML = toastMessage.errorToast(
//       'Please select a transaction type.'
//     );
//     setTimeout(() => (toastSection.innerHTML = ''), 3000);
//     return;
//   }
