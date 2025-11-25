// js/pages/transaction/transaction.js
import '../../../scss/transaction.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import {
  displayWarehouseDropdown,
  displayTransactionType,
} from './displaySelectors.js';
import { addProductRowForContainer } from './displayProducts.js';
import submitForm from './submitForm.js';
import { transactionSelectors } from './transactionSelector.js';
import Templates from '../../common/Templates';

const toastMessage = new Templates();
const { buttons, containers, form, typeSelect, toastSection } =
  transactionSelectors;

// 1. Initial setup
displayTransactionType();

// When transaction type changes:
typeSelect.addEventListener('change', () => {
  // clear previous products
  Object.values(containers).forEach((c) => (c.innerHTML = ''));
  displayWarehouseDropdown();
});

// 2. "+ Add Product" buttons
if (buttons.addInProduct) {
  buttons.addInProduct.addEventListener('click', () =>
    addProductRowForContainer('inProductsContainer')
  );
}
if (buttons.addOutProduct) {
  buttons.addOutProduct.addEventListener('click', () =>
    addProductRowForContainer('outProductsContainer')
  );
}
if (buttons.addTransferProduct) {
  buttons.addTransferProduct.addEventListener('click', () =>
    addProductRowForContainer('transferProductsContainer')
  );
}

// 3. Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = typeSelect.value;

  if (!type || !['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'].includes(type)) {
    toastSection.innerHTML = toastMessage.errorToast(
      'Please select a transaction type.'
    );
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
    return;
  }

  submitForm(type);
});
