import * as bootstrap from 'bootstrap';
import { transactionSelectors } from '../../pages/transaction/transactionSelector.js';
import { TransactionModalTemplate } from '../template/transactionModalTemplate.js';
import type { TransactionType } from '../../types/transactionType.js';

const template = new TransactionModalTemplate();

export async function confirmTransaction(type: TransactionType) {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('confirmTransactionModal');
    const summaryEl = document.getElementById('transactionSummary');
    const confirmBtn = document.getElementById('confirmTransactionBtn');

    // container for products
    let containerId!: keyof typeof transactionSelectors.containers;
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
    let rows: HTMLElement[] = [];
    if (container) {
      rows = [...container.querySelectorAll('.product-row')] as HTMLElement[];
    }

    // Collect product data
    const products: { productId: string; name: string; qty: number }[] = [];
    for (const row of rows) {
      const toggleBtn: HTMLElement = row.querySelector(
        '.dropdown-toggle'
      ) as HTMLElement; // custom dropdown
      const qtyInput: HTMLInputElement = row.querySelector(
        '.quantityInput'
      ) as HTMLInputElement;
      const qty = qtyInput ? parseInt(qtyInput.value || '0', 10) : 0;

      const productId = toggleBtn ? toggleBtn.dataset.value : null;
      const name = toggleBtn
        ? toggleBtn.querySelector('span')?.textContent.trim() + ''
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

      const supplierInputEl: HTMLInputElement | null = document.getElementById(
        'supplier'
      ) as HTMLInputElement;

      const inNotesInputEl: HTMLInputElement | null = document.getElementById(
        'inNotes'
      ) as HTMLInputElement;

      const supplier = supplierInputEl ? supplierInputEl.value : '';
      const notes = inNotesInputEl ? inNotesInputEl.value : '';
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
      const customerNameEl = document.getElementById(
        'customerName'
      ) as HTMLInputElement | null;
      const customerEmailEl = document.getElementById(
        'customerEmail'
      ) as HTMLInputElement | null;
      const customerPhoneEl = document.getElementById(
        'customerPhone'
      ) as HTMLInputElement | null;
      const customerAddressEl = document.getElementById(
        'customerAddress'
      ) as HTMLInputElement | null;
      const outNotesEl = document.getElementById(
        'outNotes'
      ) as HTMLInputElement | null;

      const customer = {
        name: customerNameEl ? customerNameEl.value : '',
        email: customerEmailEl ? customerEmailEl.value : '',
        phone: customerPhoneEl ? customerPhoneEl.value : '',
        address: customerAddressEl ? customerAddressEl.value : '',
      };
      const notes = outNotesEl ? outNotesEl.value : '';
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
      const transferNotesEl = document.getElementById(
        'transferNotes'
      ) as HTMLInputElement | null;
      const notes = transferNotesEl ? transferNotesEl.value : '';
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
      const reasonEl = document.getElementById('adjustReason');
      const notesEl = document.getElementById('adjustNotes');

      const reason =
        reasonEl && 'value' in reasonEl
          ? (reasonEl as HTMLInputElement).value
          : '';
      const notes =
        notesEl && 'value' in notesEl
          ? (notesEl as HTMLInputElement).value
          : '';
      extraHtml = template.adjustmentDetails(warehouseName, reason, notes);
    }

    // Render modal content
    if (summaryEl) {
      summaryEl.innerHTML = template.productTable(products) + extraHtml;
    }

    // Show modal
    if (modalEl && confirmBtn) {
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
    }
  });
}
