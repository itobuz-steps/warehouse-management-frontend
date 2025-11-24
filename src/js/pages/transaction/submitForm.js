import api from '../../api/interceptor';
import Templates from '../../common/Templates';
import { transactionSelectors } from './transactionSelector.js';

const toastMessage = new Templates();
const toastSection = document.getElementById('toastSection');

export default async function submitForm(type) {
  let url = '',
    body = {};
  switch (type) {
    case 'IN':
      url = 'http://localhost:3000/transaction/stock-in';
      body = {
        products: collectProducts('inProductsContainer'),
        supplier: document.getElementById('supplier').value,
        destinationWarehouse:
          transactionSelectors.warehouses.inDestinationWarehouse.value,
        notes: document.getElementById('inNotes').value,
      };
      break;

    // case 'OUT':
    //   url = 'http://localhost:3000/transaction/stock-out';
    //   body = {
    //     products: collectProducts('outProductsContainer'),
    //     customerName: document.getElementById('customerName').value,
    //     customerEmail: document.getElementById('customerEmail').value,
    //     customerPhone: document.getElementById('customerPhone').value,
    //     customerAddress: document.getElementById('customerAddress').value,
    //     orderNumber: document.getElementById('orderNumber').value,
    //     sourceWarehouse: warehouses.outSourceWarehouse.value,
    //     notes: document.getElementById('outNotes').value,
    //   };
    //   break;

    // case 'TRANSFER':
    //   url = 'http://localhost:3000/transaction/transfer';
    //   body = {
    //     products: collectProducts('transferProductsContainer'),
    //     sourceWarehouse: warehouses.sourceWarehouse.value,
    //     destinationWarehouse: warehouses.destinationWarehouse.value,
    //     notes: document.getElementById('transferNotes').value,
    //   };
    //   break;

    // case 'ADJUSTMENT':
    //   url = 'http://localhost:3000/transaction/adjustment';
    //   body = {
    //     products: collectProducts('adjustProductsContainer'),
    //     reason: document.getElementById('adjustReason').value,
    //     notes: document.getElementById('adjustNotes').value,
    //     warehouseId: warehouses.adjustWarehouseId.value,
    //   };
    //   break;
  }

  try {
    const token = localStorage.getItem('access_token');
    const res = await api.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    toastSection.innerHTML = toastMessage.successToast(
      res.data.message || 'Transaction submitted successfully!'
    );
    setTimeout(() => (toastSection.innerHTML = ''), 3000);

    transactionSelectors.form.reset();
    Object.values(transactionSelectors.sections).forEach((s) =>
      s.classList.add('hidden')
    );
    Object.values(transactionSelectors.containers).forEach(
      (c) => (c.innerHTML = '')
    );
  } catch (err) {
    const message = err.response
      ? `Error ${err.response.status}: ${err.response.data.message}`
      : `Network error: ${err.message}`;
    toastSection.innerHTML = toastMessage.errorToast(message);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
}

function collectProducts(containerId) {
  return [
    ...transactionSelectors.containers[containerId].querySelectorAll(
      '.product-row'
    ),
  ].map((r) => ({
    productId: r.querySelector('.productSelect').value,
    quantity: parseInt(r.querySelector('.quantityInput').value || '0', 10),
  }));
}
