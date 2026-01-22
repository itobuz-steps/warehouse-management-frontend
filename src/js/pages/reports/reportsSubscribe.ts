//global errors can't be fixed

import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/TransactionDetailsTemplate.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/helperApi.ts';
import { config } from '../../config/config.js';
import reportSelection from './reportsSelectors.js';
import type { Warehouse } from '../../types/warehouse.ts';
import type { User } from '../../types/user.ts';
import type { Data } from '../../types/countItem.ts';
import type { TransactionPopulated } from '../../common/template/types.ts';

const currentWarehouseId = 'ALL';
let currentPage = 1;
const pageSize = 10;
let totalPages = 1;

window.toggleDetails = function (btn) {
  const card = btn.closest<HTMLDivElement>('.transaction-card');
  if (!card) return;
  const details = card?.querySelector<HTMLDivElement>('.card-details');
  if (!details) return;

  details.classList.toggle('expanded');

  if (details.classList.contains('expanded')) {
    btn.innerHTML = 'Collapse Details <i class="fas fa-chevron-up"></i>';
  } else {
    btn.innerHTML = 'Expand Details <i class="fas fa-chevron-down"></i>';
  }
};

async function transactionDetailsLoad() {
  try {
    const user = await getCurrentUser();

    const warehouses = await getUserWarehouses();
    const transactionTemplate = new TransactionDetailsTemplate();

    renderWarehouseDropdown(warehouses, transactionTemplate);
    attachEventListeners(user, warehouses, transactionTemplate);
    setupMobileFiltersToggle();

    loadTransactions('ALL', user, warehouses, transactionTemplate);
  } catch (err) {
    console.error('Error loading transaction details:', err);
  }
}

function setupMobileFiltersToggle() {
  const btn = document.getElementById('filtersToggleBtn');
  const filters = document.querySelector('.reports-filter');
  if (!btn || !filters) return;

  btn.innerHTML = filters.classList.contains('show')
    ? '<i class="fas fa-chevron-up"></i>'
    : '<i class="fa fa-filter"></i>';

  btn.addEventListener('click', () => {
    filters.classList.toggle('show');
    const isShown = filters.classList.contains('show');
    btn.innerHTML = isShown
      ? '<i class="fas fa-chevron-up"></i>'
      : '<i class="fa fa-filter"></i>';
  });
}

function renderWarehouseDropdown(
  warehouses: Warehouse[],
  transactionTemplate: TransactionDetailsTemplate
) {
  const dropdown = document.querySelector<HTMLUListElement>(
    '.warehouses-options'
  );

  if (!dropdown) return;

  dropdown.innerHTML = `
    <li>
      <a class="dropdown-item warehouse-option active" data-id="ALL">All Warehouses</a>
    </li>
  `;

  warehouses.forEach((warehouse) => {
    dropdown.innerHTML += transactionTemplate.warehouseOptions(warehouse);
  });
}

function attachEventListeners(
  user: User,
  warehouses: Warehouse[],
  transactionTemplate: TransactionDetailsTemplate
) {
  attachWarehouseFilter(user, warehouses, transactionTemplate);
  attachDateFilter(user, warehouses, transactionTemplate);
  attachRadioFilter(user, warehouses, transactionTemplate);
  attachStatusFilter(user, warehouses, transactionTemplate);
  attachCardClickListeners();
}

function attachCardClickListeners() {
  document.addEventListener('click', (e: Event) => {
    const target = e.currentTarget;

    if (!(target instanceof HTMLElement)) return;

    const card = target.closest('.transaction-card');
    if (card) {
      if (!target.closest('button') && !target.closest('.invoice-btn')) {
        const expandBtn = card.querySelector<HTMLButtonElement>('.expand-btn');
        if (expandBtn) {
          window.toggleDetails(expandBtn);
        }
      }
    }
  });
}

function attachWarehouseFilter(
  user: User,
  warehouses: Warehouse[],
  transactionTemplate: TransactionDetailsTemplate
) {
  (
    document.querySelectorAll(
      '.warehouse-option'
    ) as NodeListOf<HTMLAnchorElement>
  ).forEach((option) => {
    option.addEventListener('click', () => {
      const id = option.getAttribute('data-id');
      if (!id) return;
      const currentWarehouseId = id;

      updateActiveWarehouse(option);

      loadTransactions(
        currentWarehouseId,
        user,
        warehouses,
        transactionTemplate
      );
    });
  });
}

function updateActiveWarehouse(option: HTMLAnchorElement) {
  reportSelection.dropdownBtn.textContent = option.textContent.trim();

  document.querySelectorAll('.warehouse-option').forEach((opt) => {
    opt.classList.remove('active');
  });

  option.classList.add('active');
  resetDateFilter();

  const filters = document.querySelector('.reports-filter');
  const btn = document.getElementById('filtersToggleBtn');
  if (window.innerWidth <= 991 && filters && btn) {
    filters.classList.remove('show');
    btn.innerHTML = '<i class="fa fa-filter"></i>';
  }
}

function resetDateFilter() {
  reportSelection.startDate.value = '';
  reportSelection.endDate.value = '';
  currentPage = 1;
}

function attachDateFilter(
  user: User,
  warehouses: Warehouse[],
  transactionTemplate: TransactionDetailsTemplate
) {
  reportSelection.dateFilter.addEventListener('click', () => {
    // const warehouseId = document
    //   .querySelector('.warehouse-option.active')
    //   .getAttribute('data-id');
    const option = document.querySelector<HTMLAnchorElement>(
      '.warehouse-option.active'
    );

    if (!option || !option.dataset.id) return;

    const warehouseId = option.dataset.id;
    loadTransactions(warehouseId, user, warehouses, transactionTemplate); // reload with date filters
  });
}

function attachRadioFilter(
  user: User,
  warehouses: Warehouse[],
  transactionTemplate: TransactionDetailsTemplate
) {
  document.querySelectorAll('input[name="btnradio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      resetDateFilter();
      toggleStatusFilter();
      loadTransactions(
        currentWarehouseId,
        user,
        warehouses,
        transactionTemplate
      );
    });
  });

  toggleStatusFilter();
}

function attachStatusFilter(
  user: User,
  warehouses: Warehouse[],
  transactionTemplate: TransactionDetailsTemplate
) {
  document.querySelectorAll('input[name="statusRadio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      resetDateFilter();
      loadTransactions(
        currentWarehouseId,
        user,
        warehouses,
        transactionTemplate
      );
    });
  });
}

function toggleStatusFilter() {
  const selectedType = (
    document.querySelector('input[name="btnradio"]:checked') as HTMLInputElement
  ).id;
  const statusFilterSection =
    document.querySelector<HTMLElement>('.status-filter');
  if (!statusFilterSection) return;

  if (selectedType === 'Out') {
    statusFilterSection.style.display = 'flex'; // show
  } else {
    statusFilterSection.style.display = 'none'; // hide

    (document.getElementById('statusAll') as HTMLInputElement).checked = true;
  }
}

async function loadTransactions(
  warehouseId: string,
  _user: User | null,
  _warehouses: Warehouse[] | null,
  transactionTemplate: TransactionDetailsTemplate,
  append = false
) {
  try {
    let result;
    const params = buildQueryParams(currentPage);

    if (warehouseId === 'ALL') {
      result = await api.get(`${config.TRANSACTION_BASE_URL}/${params}`);
    } else {
      result = await api.get(
        `${config.TRANSACTION_BASE_URL}/warehouse-specific-transaction/${warehouseId}${params}`
      );
    }

    const { transactions, counts, pagination } = result.data.data;

    if (append) {
      renderTransactionsListAppend(transactions, transactionTemplate);
    } else {
      renderTransactionsList(transactions, transactionTemplate);
    }

    renderCounts(counts);

    totalPages = pagination.totalPages;
    toggleLoadMoreButton();
  } catch (err) {
    console.error('Error loading transactions:', err);
  }
}

function toggleLoadMoreButton() {
  const btn = document.getElementById('loadMoreBtn') as HTMLButtonElement;
  btn.style.display = currentPage < totalPages ? 'block' : 'none';
}

document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
  currentPage++;
  loadTransactions(
    currentWarehouseId,
    null,
    null,
    new TransactionDetailsTemplate(),
    true
  );
});

function renderTransactionsListAppend(
  transactions: TransactionPopulated[],
  transactionTemplate: TransactionDetailsTemplate
) {
  if (!transactions || transactions.length === 0) {
    return;
  }

  transactions.forEach((transaction) => {
    let block;

    switch (transaction.type) {
      case 'IN':
        block = transactionTemplate.stockInDetails(transaction);
        break;
      case 'OUT':
        block = transactionTemplate.stockOutDetails(transaction);
        break;
      case 'ADJUSTMENT':
        block = transactionTemplate.stockAdjustDetails(transaction);
        break;
      case 'TRANSFER':
        block = transactionTemplate.stockTransferDetails(transaction);
        break;
    }
    reportSelection.reportSection.innerHTML += block;
  });

  attachInvoiceListeners();
  attachShipCancelListeners();
}

function attachShipCancelListeners() {
  document.querySelectorAll<HTMLButtonElement>('.ship-btn').forEach((btn) => {
    btn.addEventListener('click', async (event: Event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLButtonElement)) return;
      // const id = target.value || target.closest('.ship-btn').value;
      // document.getElementById('shipBtn').disabled = true;
      const id = target.value;
      target.disabled = true;
      try {
        await api.patch(
          `${config.NOTIFICATION_BASE_URL}/change-shipment-status/${id}`
        );
        const card = document.querySelector(
          `.transaction-card[data-id="${id}"]`
        );
        if (card) {
          const badge = card.querySelector('.status-badge');
          if (badge) {
            badge.classList.remove('pending');
            badge.classList.add('shipped');
            badge.textContent = 'SHIPPED';
          }
          const actions = card.querySelectorAll('.ship-btn, .cancel-btn');
          actions.forEach((a) => a.remove());
        }
      } catch (err) {
        console.error('Error shipping transaction:', err);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.cancel-btn').forEach((btn) => {
    btn.addEventListener('click', async (event: Event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLButtonElement)) return;
      // const id = target.value || target.closest('.cancel-btn').value;
      // document.getElementById('cancelBtn').disabled = true;
      const id = target.value;
      target.disabled = true;
      try {
        await api.patch(
          `${config.NOTIFICATION_BASE_URL}/cancel-shipment/${id}`
        );
        const card = document.querySelector(
          `.transaction-card[data-id="${id}"]`
        );
        if (card) {
          const badge = card.querySelector('.status-badge');
          if (badge) {
            badge.classList.remove('pending');
            badge.classList.add('cancelled');
            badge.textContent = 'CANCELLED';
          }
          const actions = card.querySelectorAll('.ship-btn, .cancel-btn');
          actions.forEach((a) => a.remove());
        }
      } catch (err) {
        console.error('Error cancelling transaction:', err);
      }
    });
  });
}

function buildQueryParams(page = 1) {
  const params = new URLSearchParams();

  const startDate = reportSelection.startDate.value;
  const endDate = reportSelection.endDate.value;

  if (startDate) {
    params.append('startDate', startDate);
  }

  if (endDate) {
    params.append('endDate', endDate);
  }

  const selectedRadio = document.querySelector(
    'input[name="btnradio"]:checked'
  );

  let type;
  if (selectedRadio) {
    const filterMap = {
      All: 'ALL',
      In: 'IN',
      Out: 'OUT',
      Adjust: 'ADJUSTMENT',
      Transfer: 'TRANSFER',
    };
    type FilterKey = keyof typeof filterMap;
    const key = selectedRadio.id as FilterKey;
    type = filterMap[key];

    // type = filterMap[selectedRadio.id];

    if (type && type !== 'ALL') {
      params.append('type', type);
    }
  }

  const selectedStatus = document.querySelector(
    'input[name="statusRadio"]:checked'
  );

  if (type === 'OUT' && selectedStatus && selectedStatus.id !== 'statusAll') {
    params.append('status', selectedStatus.id);
  }

  params.append('page', String(page));
  params.append('limit', String(pageSize));

  return params.toString() ? `?${params.toString()}` : '';
}

function renderCounts(counts: Data) {
  console.log('count', counts);
  (document.getElementById('count-all') as HTMLSpanElement).textContent = '0';
  (document.getElementById('count-in') as HTMLSpanElement).textContent = '0';
  (document.getElementById('count-out') as HTMLSpanElement).textContent = '0';
  (document.getElementById('count-transfer') as HTMLSpanElement).textContent =
    '0';
  (document.getElementById('count-adjust') as HTMLSpanElement).textContent =
    '0';
  (document.getElementById('count-pending') as HTMLSpanElement).textContent =
    '0';
  (document.getElementById('count-shipped') as HTMLSpanElement).textContent =
    '0';
  (document.getElementById('count-cancelled') as HTMLSpanElement).textContent =
    '0';

  counts.types.forEach((item) => {
    switch (item._id) {
      case 'IN':
        (document.getElementById('count-in') as HTMLElement).textContent =
          String(item.count);
        break;
      case 'OUT':
        (document.getElementById('count-out') as HTMLElement).textContent =
          String(item.count);
        break;
      case 'TRANSFER':
        (document.getElementById('count-transfer') as HTMLElement).textContent =
          String(item.count);
        break;
      case 'ADJUSTMENT':
        (document.getElementById('count-adjust') as HTMLElement).textContent =
          String(item.count);
        break;
      default:
        break;
    }
  });

  // Calculate total for ALL types
  const totalTypes = counts.types.reduce((acc, curr) => acc + curr.count, 0);
  (document.getElementById('count-all') as HTMLElement).textContent =
    String(totalTypes);

  // Update status counts (only for OUT type)
  counts.status.forEach((item) => {
    switch (item._id) {
      case 'PENDING':
        (document.getElementById('count-pending') as HTMLElement).textContent =
          String(item.count);
        break;
      case 'SHIPPED':
        (document.getElementById('count-shipped') as HTMLElement).textContent =
          String(item.count);
        break;
      case 'CANCELLED':
        (
          document.getElementById('count-cancelled') as HTMLElement
        ).textContent = String(item.count);
        break;
      default:
        break;
    }
  });

  const totalStatus = counts.status.reduce((acc, curr) => acc + curr.count, 0);
  (document.getElementById('count-all-status') as HTMLElement).textContent =
    String(totalStatus);
}

function renderTransactionsList(
  transactions: TransactionPopulated[],
  transactionTemplate: TransactionDetailsTemplate
) {
  reportSelection.reportSection.innerHTML = '';

  if (!transactions || transactions.length === 0) {
    reportSelection.reportSection.innerHTML =
      transactionTemplate.noStockIndicate();
    return;
  }

  transactions.forEach((transaction) => {
    let block;
    switch (transaction.type) {
      case 'IN':
        block = transactionTemplate.stockInDetails(transaction);
        break;
      case 'OUT':
        block = transactionTemplate.stockOutDetails(transaction);
        break;
      case 'ADJUSTMENT':
        block = transactionTemplate.stockAdjustDetails(transaction);
        break;
      case 'TRANSFER':
        block = transactionTemplate.stockTransferDetails(transaction);
        break;
    }
    reportSelection.reportSection.innerHTML += block;
  });

  attachInvoiceListeners();
  attachShipCancelListeners();
}

function attachInvoiceListeners() {
  document
    .querySelectorAll<HTMLButtonElement>('.invoice-btn')
    .forEach((btn) => {
      btn.addEventListener('click', async (event: Event) => {
        try {
          const target = event.currentTarget;
          if (!(target instanceof HTMLButtonElement)) return;
          const invoiceButton =
            target.closest<HTMLButtonElement>('.invoice-btn');
          const id = target.value || invoiceButton?.value;
          if (!id) return;
          const result = await api.get(
            `${config.TRANSACTION_BASE_URL}/generate-invoice/${id}`,
            { responseType: 'blob' }
          );

          const blob = new Blob([result.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const pdfLink = document.createElement('a');
          pdfLink.href = url;
          pdfLink.download = `invoice-${id}.pdf`;
          pdfLink.click();

          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error(err);
        }
      });
    });
}

export default transactionDetailsLoad;
