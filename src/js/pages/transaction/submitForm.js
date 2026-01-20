import api from '../../api/interceptor.js';
import { Templates } from '../../common/Templates.js';
import { transactionSelectors } from './transactionSelector.js';
import { confirmTransaction } from '../../common/modals/confirmModal.js';
import { config } from '../../config/config.js';

const toastMessage = new Templates();
const { toastSection, warehouses, containers } = transactionSelectors;
const submitSpinner = document.getElementById('submitSpinner');

export default async function submitForm(type) {
  const confirmed = await confirmTransaction(type);

  if (!confirmed) {
    return;
  }
  transactionSelectors.submitTransactionBtn.disabled = true;

  let url = '';
  let body = {};

  switch (type) {
    case 'IN': {
      const products = await collectProducts('inProductsContainer');

      if (!products) {
        return;
      }

      url = `${config.TRANSACTION_BASE_URL}/stock-in`;
      body = {
        products,
        supplier: document.getElementById('supplier').value,
        destinationWarehouse: warehouses.destinationWarehouse.value,
        notes: document.getElementById('inNotes').value,
      };
      break;
    }

    case 'OUT': {
      url = `${config.TRANSACTION_BASE_URL}/stock-out`;

      body = {
        products: await collectProducts('outProductsContainer'),
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: document.getElementById('customerAddress').value,
        sourceWarehouse: warehouses.sourceWarehouse.value,
        notes: document.getElementById('outNotes').value,
      };
      break;
    }

    case 'TRANSFER': {
      url = `${config.TRANSACTION_BASE_URL}/transfer`;
      body = {
        products: await collectProducts('transferProductsContainer'),
        sourceWarehouse: warehouses.sourceWarehouse.value,
        destinationWarehouse: warehouses.destinationWarehouse.value,
        notes: document.getElementById('transferNotes').value,
      };
      break;
    }

    case 'ADJUSTMENT': {
      url = `${config.TRANSACTION_BASE_URL}/adjustment`;
      body = {
        products: await collectProducts('adjustProductsContainer'),
        reason: document.getElementById('adjustReason').value,
        notes: document.getElementById('adjustNotes').value,
        // using common sourceWarehouse as adjustment warehouse
        warehouseId: warehouses.sourceWarehouse.value,
      };
      break;
    }

    default: {
      return;
    }
  }

  try {
    submitSpinner.classList.remove('d-none');

    const res = await api.post(url, body);

    transactionSelectors.form.reset();

    submitSpinner.classList.add('d-none');

    showToast('success', res.data.message);
  } catch (err) {
    submitSpinner.classList.add('d-none');
    showToast('error', err.response.data.message);
  } finally {
    transactionSelectors.submitTransactionBtn.disabled = false;
    transactionSelectors.typeSelect.onchange = () => {
      document
        .querySelectorAll(
          `#transactionForm input[type="text"],
       #transactionForm input[type="email"]`
        )
        .forEach((input) => {
          input.value = '';
        });
      transactionSelectors.buttons.addInProduct.disabled = true;
      transactionSelectors.buttons.addOutProduct.disabled = true;
      transactionSelectors.buttons.addTransferProduct.disabled = true;
      transactionSelectors.addNewProduct.disabled = true;
    };
  }
}

async function collectProducts(containerId) {
  const container = containers[containerId];

  if (!container) {
    return [];
  }

  let warehouseCapacity = 0,
    presentWarehouseCapacity = 0;

  if (containerId === 'inProductsContainer') {
    try {
      const res = await api.get(
        `${config.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${warehouses.destinationWarehouse.value}`
      );

      presentWarehouseCapacity = res?.data?.data?.totalQuantity ?? 0;
      warehouseCapacity = res.data.data.warehouse.capacity;
    } catch (err) {
      console.error('Failed to fetch warehouse capacity:', err);
      presentWarehouseCapacity = 0;
    }
  }

  const products = [];

  for (const row of container.querySelectorAll('.product-row')) {
    const toggleBtn = row.querySelector('.dropdown-toggle');
    const productId = toggleBtn ? toggleBtn.dataset.value : null;

    const quantityInput = row.querySelector('.quantityInput');
    const quantity = quantityInput
      ? parseInt(quantityInput.value || '0', 10)
      : 0;

    const limitInput = row.querySelector('.limitInput');
    const limit = limitInput ? parseInt(limitInput.value || '1', 10) : 1;

    // check warehouse capacity
    if (containerId === 'inProductsContainer') {
      if (quantity + presentWarehouseCapacity > warehouseCapacity) {
        showToast(
          'error',
          `Can not Stock in Products, exceeded warehouse capacity.`
        );

        return null; // reject transaction
      }

      presentWarehouseCapacity += quantity;
    }

    products.push({ productId, quantity, limit });
  }

  return products;
}

function showToast(type, message) {
  toastSection.innerHTML =
    type === 'success'
      ? toastMessage.successToast(message)
      : toastMessage.errorToast(message);

  setTimeout(() => {
    toastSection.innerHTML = '';
  }, 3000);
}
