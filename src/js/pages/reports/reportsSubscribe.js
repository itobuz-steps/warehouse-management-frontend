import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/TransactionDetailsTemplate.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/HelperApi.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

let currentWarehouseId = 'ALL'; // track of the current warehouse ID
let currentPage = 1; // current page
const pageSize = 10; // items per page
let totalPages = 1; // total pages from backend

// Make toggleDetails available globally for onclick handlers
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

    // Load ALL transactions by default
    loadTransactions('ALL', user, warehouses, transactionTemplate);
  } catch (err) {
    console.error('Error loading transaction details:', err);
  }
}

// Setup mobile filter toggle
function setupMobileFiltersToggle() {
  const btn = document.getElementById('filtersToggleBtn');
  const filters = document.querySelector('.reports-filter');
  if (!btn || !filters) return;

  // initialize label
  btn.innerHTML = filters.classList.contains('show')
    ? '<i class="fas fa-chevron-up"></i> Hide Filters'
    : '<i class="fa fa-filter"></i> Filters';

  btn.addEventListener('click', () => {
    filters.classList.toggle('show');
    const isShown = filters.classList.contains('show');
    btn.innerHTML = isShown
      ? '<i class="fas fa-chevron-up"></i> Hide Filters'
      : '<i class="fa fa-filter"></i> Filters';
  });
}

// Render warehouse dropdown with specific warehouses
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

// Attach all necessary event listeners
function attachEventListeners(user, warehouses, transactionTemplate) {
  attachWarehouseFilter(user, warehouses, transactionTemplate);
  attachDateFilter(user, warehouses, transactionTemplate);
  attachRadioFilter(user, warehouses, transactionTemplate);
  attachStatusFilter(user, warehouses, transactionTemplate);
  attachCardClickListeners();
}

// Attach click listener to entire card for expanding
function attachCardClickListeners() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.transaction-card');
    if (card) {
      // Don't toggle if clicking on a button
      if (!e.target.closest('button') && !e.target.closest('.invoice-btn')) {
        const expandBtn = card.querySelector('.expand-btn');
        if (expandBtn) {
          window.toggleDetails(expandBtn);
        }
      }
    }
  });
}

// Attach event listener for warehouse filter
function attachWarehouseFilter(user, warehouses, transactionTemplate) {
  document.querySelectorAll('.warehouse-option').forEach((option) => {
    option.addEventListener('click', () => {
      // Update selected warehouse-id
      currentWarehouseId = option.getAttribute('data-id');

      // Update UI to reflect the active warehouse
      updateActiveWarehouse(option);

      // Load transactions based on the selected warehouse, passing the required parameters
      loadTransactions(
        currentWarehouseId,
        user,
        warehouses,
        transactionTemplate
      );
    });
  });
}

// Update the UI when a warehouse option is clicked
function updateActiveWarehouse(option) {
  reportSelection.dropdownBtn.textContent = option.textContent.trim();

  document.querySelectorAll('.warehouse-option').forEach((opt) => {
    opt.classList.remove('active');
  });

  option.classList.add('active');
  resetDateFilter();

  // Close filters on mobile after selection
  const filters = document.querySelector('.reports-filter');
  const btn = document.getElementById('filtersToggleBtn');
  if (window.innerWidth <= 991 && filters && btn) {
    filters.classList.remove('show');
    btn.innerHTML = '<i class="fa fa-filter"></i> Filters';
  }
}

// Reset the date filter
function resetDateFilter() {
  reportSelection.startDate.value = '';
  reportSelection.endDate.value = '';
  currentPage = 1;
}

// Attach event listener for date filter button
function attachDateFilter(user, warehouses, transactionTemplate) {
  reportSelection.dateFilter.addEventListener('click', () => {
    const warehouseId = document
      .querySelector('.warehouse-option.active')
      .getAttribute('data-id');
    loadTransactions(warehouseId, user, warehouses, transactionTemplate); // reload with date filters
  });
}

// Attach event listener for type
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

// shipment status filter
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

// Load transactions based on filters
async function loadTransactions(
  warehouseId,
  user,
  warehouses,
  transactionTemplate,
  append = false // if true, append instead of replace
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

  // Total status for ALL
  const totalStatus = counts.status.reduce((acc, curr) => acc + curr.count, 0);
  document.getElementById('count-all-status').textContent = totalStatus;
}

// Render list of transactions
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
}

// Attach listeners for invoice download buttons
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
