import * as bootstrap from 'bootstrap';
import { transactionSelectors } from '../../pages/transaction/transactionSelector.js';
import TransactionModalTemplate from '../template/transactionModalTemplate.js';

const template = new TransactionModalTemplate();

export async function confirmTransaction(type) {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('confirmTransactionModal');
    const summaryEl = document.getElementById('transactionSummary');
    const confirmBtn = document.getElementById('confirmTransactionBtn');

    // container for products
    let containerId = '';
    if (type === 'IN') {
      containerId = 'inProductsContainer';
    } else if (type === 'OUT') {
      containerId = 'outProductsContainer';
    } else if (type === 'TRANSFER') {
      containerId = 'transferProductsContainer';
    } else if (type === 'ADJUSTMENT') {
      containerId = 'adjustProductsContainer';
    }

    const container = transactionSelectors.containers[containerId];
    let rows = [];
    if (container) {
      rows = [...container.querySelectorAll('.product-row')];
    }

    // Collect product data
    const products = [];
    for (let row of rows) {
      const toggleBtn = row.querySelector('.dropdown-toggle'); // custom dropdown
      const qtyInput = row.querySelector('.quantityInput');
      const qty = qtyInput ? parseInt(qtyInput.value || '0', 10) : 0;

      const productId = toggleBtn ? toggleBtn.dataset.value : null;
      const name = toggleBtn
        ? toggleBtn.querySelector('span').textContent.trim()
        : 'N/A';

      if (productId && qty > 0) {
        products.push({ productId, name, qty });
      }
    }

    // Collect extra details
    let extraHtml = '';
    const { warehouses } = transactionSelectors;

    if (type === 'IN') {
      let warehouseName = 'N/A';
      if (
        warehouses.destinationWarehouse &&
        warehouses.destinationWarehouse.options[
          warehouses.destinationWarehouse.selectedIndex
        ]
      ) {
        warehouseName =
          warehouses.destinationWarehouse.options[
            warehouses.destinationWarehouse.selectedIndex
          ].text;
      }
      const supplier = document.getElementById('supplier')
        ? document.getElementById('supplier').value
        : '';
      const notes = document.getElementById('inNotes')
        ? document.getElementById('inNotes').value
        : '';
      extraHtml = template.stockInDetails(warehouseName, supplier, notes);
    } else if (type === 'OUT') {
      let warehouseName = 'N/A';
      if (
        warehouses.sourceWarehouse &&
        warehouses.sourceWarehouse.options[
          warehouses.sourceWarehouse.selectedIndex
        ]
      ) {
        warehouseName =
          warehouses.sourceWarehouse.options[
            warehouses.sourceWarehouse.selectedIndex
          ].text;
      }
      const customer = {
        name: document.getElementById('customerName')
          ? document.getElementById('customerName').value
          : '',
        email: document.getElementById('customerEmail')
          ? document.getElementById('customerEmail').value
          : '',
        phone: document.getElementById('customerPhone')
          ? document.getElementById('customerPhone').value
          : '',
        address: document.getElementById('customerAddress')
          ? document.getElementById('customerAddress').value
          : '',
        orderNumber: document.getElementById('orderNumber')
          ? document.getElementById('orderNumber').value
          : '',
      };
      const notes = document.getElementById('outNotes')
        ? document.getElementById('outNotes').value
        : '';
      extraHtml = template.stockOutDetails(warehouseName, customer, notes);
    } else if (type === 'TRANSFER') {
      let source = 'N/A';
      if (
        warehouses.sourceWarehouse &&
        warehouses.sourceWarehouse.options[
          warehouses.sourceWarehouse.selectedIndex
        ]
      ) {
        source =
          warehouses.sourceWarehouse.options[
            warehouses.sourceWarehouse.selectedIndex
          ].text;
      }
      let dest = 'N/A';
      if (
        warehouses.destinationWarehouse &&
        warehouses.destinationWarehouse.options[
          warehouses.destinationWarehouse.selectedIndex
        ]
      ) {
        dest =
          warehouses.destinationWarehouse.options[
            warehouses.destinationWarehouse.selectedIndex
          ].text;
      }
      const notes = document.getElementById('transferNotes')
        ? document.getElementById('transferNotes').value
        : '';
      extraHtml = template.transferDetails(source, dest, notes);
    } else if (type === 'ADJUSTMENT') {
      let warehouseName = 'N/A';
      if (
        warehouses.sourceWarehouse &&
        warehouses.sourceWarehouse.options[
          warehouses.sourceWarehouse.selectedIndex
        ]
      ) {
        warehouseName =
          warehouses.sourceWarehouse.options[
            warehouses.sourceWarehouse.selectedIndex
          ].text;
      }
      const reason = document.getElementById('adjustReason')
        ? document.getElementById('adjustReason').value
        : '';
      const notes = document.getElementById('adjustNotes')
        ? document.getElementById('adjustNotes').value
        : '';
      extraHtml = template.adjustmentDetails(warehouseName, reason, notes);
    }

    // Render modal content
    summaryEl.innerHTML = template.productTable(products) + extraHtml;

    // Show modal
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const onConfirm = () => {
      cleanup();
      modal.hide();
      resolve(true);
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      confirmBtn.removeEventListener('click', onConfirm);
      modalEl.removeEventListener('hidden.bs.modal', onCancel);
    };

    confirmBtn.addEventListener('click', onConfirm);
    modalEl.addEventListener('hidden.bs.modal', onCancel);
  });
}
