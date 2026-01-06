import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/TransactionDetailsTemplate.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/HelperApi.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

let currentWarehouseId = 'ALL';
let currentPage = 1;
const pageSize = 10;
let totalPages = 1;

window.toggleDetails = function (btn) {
  const card = btn.closest('.transaction-card');
  const details = card.querySelector('.card-details');

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

function renderWarehouseDropdown(warehouses, transactionTemplate) {
  const dropdown = document.querySelector('.warehouses-options');
  dropdown.innerHTML = `
    <li>
      <a class="dropdown-item warehouse-option active" data-id="ALL">All Warehouses</a>
    </li>
  `;

  warehouses.forEach((warehouse) => {
    dropdown.innerHTML += transactionTemplate.warehouseOptions(warehouse);
  });
}

function attachEventListeners(user, warehouses, transactionTemplate) {
  attachWarehouseFilter(user, warehouses, transactionTemplate);
  attachDateFilter(user, warehouses, transactionTemplate);
  attachRadioFilter(user, warehouses, transactionTemplate);
  attachStatusFilter(user, warehouses, transactionTemplate);
  attachCardClickListeners();
}

function attachCardClickListeners() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.transaction-card');
    if (card) {
      if (!e.target.closest('button') && !e.target.closest('.invoice-btn')) {
        const expandBtn = card.querySelector('.expand-btn');
        if (expandBtn) {
          window.toggleDetails(expandBtn);
        }
      }
    }
  });
}

function attachWarehouseFilter(user, warehouses, transactionTemplate) {
  document.querySelectorAll('.warehouse-option').forEach((option) => {
    option.addEventListener('click', () => {
      currentWarehouseId = option.getAttribute('data-id');

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

function updateActiveWarehouse(option) {
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

function attachDateFilter(user, warehouses, transactionTemplate) {
  reportSelection.dateFilter.addEventListener('click', () => {
    const warehouseId = document
      .querySelector('.warehouse-option.active')
      .getAttribute('data-id');
    loadTransactions(warehouseId, user, warehouses, transactionTemplate); // reload with date filters
  });
}

function attachRadioFilter(user, warehouses, transactionTemplate) {
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

function attachStatusFilter(user, warehouses, transactionTemplate) {
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
  const selectedType = document.querySelector(
    'input[name="btnradio"]:checked'
  ).id;
  const statusFilterSection = document.querySelector('.status-filter');

  if (selectedType === 'Out') {
    statusFilterSection.style.display = 'flex'; // show
  } else {
    statusFilterSection.style.display = 'none'; // hide

    document.getElementById('statusAll').checked = true;
  }
}

async function loadTransactions(
  warehouseId,
  user,
  warehouses,
  transactionTemplate,
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
  const btn = document.getElementById('loadMoreBtn');
  btn.style.display = currentPage < totalPages ? 'block' : 'none';
}

document.getElementById('loadMoreBtn').addEventListener('click', () => {
  currentPage++;
  loadTransactions(
    currentWarehouseId,
    null,
    null,
    new TransactionDetailsTemplate(),
    true
  );
});

function renderTransactionsListAppend(transactions, transactionTemplate) {
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
  document.querySelectorAll('.ship-btn').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const id = event.target.value || event.target.closest('.ship-btn').value;
      document.getElementById('shipBtn').disabled = true;
      try {
        await api.patch(
          `${config.BROWSER_NOTIFICATION_BASE_URL}/change-shipment-status/${id}`
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

  document.querySelectorAll('.cancel-btn').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const id =
        event.target.value || event.target.closest('.cancel-btn').value;
      document.getElementById('cancelBtn').disabled = true;
      try {
        await api.patch(
          `${config.BROWSER_NOTIFICATION_BASE_URL}/cancel-shipment/${id}`
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
    type = filterMap[selectedRadio.id];

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

  params.append('page', page);
  params.append('limit', pageSize);

  return params.toString() ? `?${params.toString()}` : '';
}

function renderCounts(counts) {
  document.getElementById('count-all').textContent = 0;
  document.getElementById('count-in').textContent = 0;
  document.getElementById('count-out').textContent = 0;
  document.getElementById('count-transfer').textContent = 0;
  document.getElementById('count-adjust').textContent = 0;
  document.getElementById('count-all-status').textContent = 0;
  document.getElementById('count-pending').textContent = 0;
  document.getElementById('count-shipped').textContent = 0;
  document.getElementById('count-cancelled').textContent = 0;

  counts.types.forEach((item) => {
    switch (item._id) {
      case 'IN':
        document.getElementById('count-in').textContent = item.count;
        break;
      case 'OUT':
        document.getElementById('count-out').textContent = item.count;
        break;
      case 'TRANSFER':
        document.getElementById('count-transfer').textContent = item.count;
        break;
      case 'ADJUSTMENT':
        document.getElementById('count-adjust').textContent = item.count;
        break;
      default:
        break;
    }
  });

  // Calculate total for ALL types
  const totalTypes = counts.types.reduce((acc, curr) => acc + curr.count, 0);
  document.getElementById('count-all').textContent = totalTypes;

  // Update status counts (only for OUT type)
  counts.status.forEach((item) => {
    switch (item._id) {
      case 'PENDING':
        document.getElementById('count-pending').textContent = item.count;
        break;
      case 'SHIPPED':
        document.getElementById('count-shipped').textContent = item.count;
        break;
      case 'CANCELLED':
        document.getElementById('count-cancelled').textContent = item.count;
        break;
      default:
        break;
    }
  });

  const totalStatus = counts.status.reduce((acc, curr) => acc + curr.count, 0);
  document.getElementById('count-all-status').textContent = totalStatus;
}

function renderTransactionsList(transactions, transactionTemplate) {
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
  document.querySelectorAll('.invoice-btn').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      try {
        const id =
          event.target.value || event.target.closest('.invoice-btn').value;
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
