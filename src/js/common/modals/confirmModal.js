import * as bootstrap from 'bootstrap';
import { transactionSelectors } from '../../pages/transaction/transactionSelector.js';

export function confirmTransaction(type) {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('confirmTransactionModal');
    const summaryEl = document.getElementById('transactionSummary');
    const confirmBtn = document.getElementById('confirmTransactionBtn');

    // Insert styled transaction summary
    summaryEl.innerHTML = generateStyledSummary(type);

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const clean = () => {
      confirmBtn.removeEventListener('click', onConfirm);
      modalEl.removeEventListener('hidden.bs.modal', onCancel);
    };

    const onConfirm = () => {
      clean();
      modal.hide();
      resolve(true);
    };

    const onCancel = () => {
      clean();
      resolve(false);
    };

    confirmBtn.addEventListener('click', onConfirm);
    modalEl.addEventListener('hidden.bs.modal', onCancel);
  });
}

// Generate summary as table + extra fields
function generateStyledSummary(type) {
  const { containers, warehouses } = transactionSelectors;

  const containerMap = {
    IN: 'inProductsContainer',
    OUT: 'outProductsContainer',
    TRANSFER: 'transferProductsContainer',
    ADJUSTMENT: 'adjustProductsContainer',
  };

  const container = containers[containerMap[type]];
  const rows = container ? [...container.querySelectorAll('.product-row')] : [];


  //  PRODUCT TABLE

  const productRows = rows
    .map((row) => {
      const select = row.querySelector('.productSelect');
      const qty = row.querySelector('.quantityInput')?.value || 0;
      const productName = select?.options[select.selectedIndex]?.text || 'N/A';

      return `
        <tr>
          <td><i class="fa-solid fa-box me-1 text-primary"></i>${productName}</td>
          <td class="text-center fw-bold">${qty}</td>
        </tr>
      `;
    })
    .join('');

  const productTable =
    productRows.length > 0
      ? `
      <div class="summary-section p-3 rounded border mb-4 bg-light">
        <h5 class="fw-bold mb-3 text-primary">
          <i class="fa-solid fa-cubes me-2"></i>Products Summary
        </h5>

        <table class="table table-sm table-bordered">
          <thead class="table-secondary">
            <tr>
              <th style="width:70%">Product</th>
              <th class="text-center" style="width:30%">Quantity</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
      </div>`
      : `
      <div class="p-3 rounded border bg-light mb-4">
        <p class="text-muted">No products added.</p>
      </div>
    `;

  // Warehouse names
  const sourceWarehouseName =
    warehouses.sourceWarehouse.options[warehouses.sourceWarehouse.selectedIndex]
      ?.text || 'N/A';

  const destinationWarehouseName =
    warehouses.destinationWarehouse.options[
      warehouses.destinationWarehouse.selectedIndex
    ]?.text || 'N/A';


  let extraHtml = '';

  const sectionBox = (title, content) => `
    <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
      <h6 class="fw-bold mb-2 text-primary">
        <i class="fa-solid fa-circle-info me-2"></i>${title}
      </h6>
      ${content}
    </div>
  `;

  switch (type) {
    case 'IN':
      extraHtml = sectionBox(
        'Stock In Details',
        `
          <p><strong>Destination Warehouse:</strong> 
            <span class="badge bg-success">${destinationWarehouseName}</span>
          </p>
          <p><strong>Supplier:</strong> ${document.getElementById('supplier').value || '-'}</p>
          <p><strong>Notes:</strong> ${document.getElementById('inNotes').value || '-'}</p>
        `
      );
      break;

    case 'OUT':
      extraHtml = sectionBox(
        'Stock Out Details',
        `
          <p><strong>Source Warehouse:</strong> 
            <span class="badge bg-danger">${sourceWarehouseName}</span>
          </p>
          <p><strong>Customer:</strong> ${document.getElementById('customerName').value || '-'}</p>
          <p><strong>Email:</strong> ${document.getElementById('customerEmail').value || '-'}</p>
          <p><strong>Phone:</strong> ${document.getElementById('customerPhone').value || '-'}</p>
          <p><strong>Address:</strong> ${document.getElementById('customerAddress').value || '-'}</p>
          <p><strong>Order Number:</strong> ${document.getElementById('orderNumber').value || '-'}</p>
          <p><strong>Notes:</strong> ${document.getElementById('outNotes').value || '-'}</p>
        `
      );
      break;

    case 'TRANSFER':
      extraHtml = sectionBox(
        'Transfer Details',
        `
          <p><strong>Source Warehouse:</strong> 
            <span class="badge bg-danger">${sourceWarehouseName}</span>
          </p>
          <p><strong>Destination Warehouse:</strong> 
            <span class="badge bg-success">${destinationWarehouseName}</span>
          </p>
          <p><strong>Notes:</strong> ${document.getElementById('transferNotes').value || '-'}</p>
        `
      );
      break;

    case 'ADJUSTMENT':
      extraHtml = sectionBox(
        'Adjustment Details',
        `
          <p><strong>Warehouse:</strong> 
            <span class="badge bg-warning text-dark">${sourceWarehouseName}</span>
          </p>
          <p><strong>Reason:</strong> ${document.getElementById('adjustReason').value || '-'}</p>
          <p><strong>Notes:</strong> ${document.getElementById('adjustNotes').value || '-'}</p>
        `
      );
      break;
  }

  return `${productTable}${extraHtml}`;
}
