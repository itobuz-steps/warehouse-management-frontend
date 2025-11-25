// js/pages/transaction/submitForm.js
import api from '../../api/interceptor';
import Templates from '../../common/Templates';
import { transactionSelectors } from './transactionSelector.js';

const toastMessage = new Templates();
const { toastSection, warehouses, containers } = transactionSelectors;

export default async function submitForm(type) {
  let url = '';
  let body = {};

  switch (type) {
    case 'IN':
      url = 'http://localhost:3000/transaction/stock-in';
      body = {
        products: collectProducts('inProductsContainer'),
        supplier: document.getElementById('supplier').value,
        destinationWarehouse: warehouses.destinationWarehouse.value,
        notes: document.getElementById('inNotes').value,
      };
      break;

    case 'OUT':
      url = 'http://localhost:3000/transaction/stock-out';
      body = {
        products: collectProducts('outProductsContainer'),
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: document.getElementById('customerAddress').value,
        orderNumber: document.getElementById('orderNumber').value,
        sourceWarehouse: warehouses.sourceWarehouse.value,
        notes: document.getElementById('outNotes').value,
      };
      break;

    case 'TRANSFER':
      url = 'http://localhost:3000/transaction/transfer';
      body = {
        products: collectProducts('transferProductsContainer'),
        sourceWarehouse: warehouses.sourceWarehouse.value,
        destinationWarehouse: warehouses.destinationWarehouse.value,
        notes: document.getElementById('transferNotes').value,
      };
      break;

    case 'ADJUSTMENT':
      url = 'http://localhost:3000/transaction/adjustment';
      body = {
        products: collectProducts('adjustProductsContainer'),
        reason: document.getElementById('adjustReason').value,
        notes: document.getElementById('adjustNotes').value,
        // using common sourceWarehouse as adjustment warehouse
        warehouseId: warehouses.sourceWarehouse.value,
      };
      break;

    default:
      return;
  }

  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      showToast('error', 'No token found. Please log in first.');
      return;
    }

    const res = await api.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    showToast(
      'success',
      res.data.message || 'Transaction submitted successfully!'
    );

    // Reset form & UI
    transactionSelectors.form.reset();
    Object.values(transactionSelectors.sections).forEach((s) =>
      s.classList.add('d-none')
    );
    Object.values(containers).forEach((c) => (c.innerHTML = ''));

    const warehouseDropdown = document.getElementById('warehouseDropdown');
    if (warehouseDropdown) warehouseDropdown.classList.add('d-none');
  } catch (err) {
    const message = err.response
      ? `Error ${err.response.status}: ${err.response.data.message}`
      : `Network error: ${err.message}`;
    showToast('error', message);
  }
}

function collectProducts(containerId) {
  const container = containers[containerId];
  if (!container) return [];

  return [...container.querySelectorAll('.product-row')]
    .map((row) => {
      const productId = row.querySelector('.productSelect')?.value;
      const quantity = parseInt(
        row.querySelector('.quantityInput')?.value || '0',
        10
      );
      return { productId, quantity };
    })
    .filter((p) => p.productId && p.quantity > 0);
}

function showToast(type, message) {
  if (!message) return;

  toastSection.innerHTML =
    type === 'success'
      ? toastMessage.successToast(message)
      : toastMessage.errorToast(message);

  setTimeout(() => {
    toastSection.innerHTML = '';
  }, 3000);
}
