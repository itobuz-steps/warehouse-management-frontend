import '../../../scss/transaction.scss';
//@ts-expect-error bootstrap import
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

import {
  displayWarehouseDropdown,
  displayTransactionType,
} from './displaySelectors.js';
import { addProductRowForContainer } from './displayProducts.js';
import submitForm from './submitForm.js';
import { transactionSelectors } from './transactionSelector.js';
import { initTransactionProductEvents } from './transactionProductEvents.js';
import type { TransactionType } from '../../types/transactionType.js';

// const toastMessage = new Templates();
const { buttons, containers, form, typeSelect } = transactionSelectors;

typeSelect.value = 'IN';
displayWarehouseDropdown();

form.addEventListener('reset', () => {
  typeSelect.value = ''; // show "Select Type"
  Object.values(containers).forEach((c) => (c.innerHTML = ''));
  buttons.addInProduct?.setAttribute('disabled', '');
  buttons.addOutProduct?.setAttribute('disabled', '');
  buttons.addTransferProduct?.setAttribute('disabled', '');
  transactionSelectors.addNewProduct?.setAttribute('disabled', '');
});

// 1. Initial setup
displayTransactionType();
displayWarehouseDropdown();

// Initialize product creation modal events
initTransactionProductEvents();

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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = typeSelect.value as TransactionType;
  submitForm(type);
});
