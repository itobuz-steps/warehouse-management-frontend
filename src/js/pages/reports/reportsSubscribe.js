import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/transactionDetailsTemplate.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/HelperApi.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

let currentWarehouseId = 'ALL'; // track of the current warehouse ID

async function transactionDetailsLoad() {
  try {
    const user = await getCurrentUser();

    const warehouses = await getUserWarehouses();
    const transactionTemplate = new TransactionDetailsTemplate();

    renderWarehouseDropdown(warehouses, transactionTemplate);
    attachEventListeners(user, warehouses, transactionTemplate);

    // Load ALL transactions by default
    loadTransactions('ALL', user, warehouses, transactionTemplate);
  } catch (err) {
    console.error('Error loading transaction details:', err);
  }
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
}

// Reset the date filter
function resetDateFilter() {
  reportSelection.startDate.value = '';
  reportSelection.endDate.value = '';
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

      loadTransactions(
        currentWarehouseId,
        user,
        warehouses,
        transactionTemplate
      );
    });
  });
}

// Load transactions based on filters
async function loadTransactions(
  warehouseId,
  user,
  warehouses,
  transactionTemplate
) {
  try {
    let result;
    const params = buildQueryParams();

    if (warehouseId === 'ALL') {
      result = await api.get(`${config.TRANSACTION_BASE_URL}/${params}`);
    } else {
      result = await api.get(
        `${config.TRANSACTION_BASE_URL}/warehouse-specific-transaction/${warehouseId}${params}`
      );
    }

    const allTransactions = filterTransactions(
      result.data.data,
      user,
      warehouses
    );
    renderTransactionsList(allTransactions, transactionTemplate);
  } catch (err) {
    console.error('Error loading transactions:', err);
  }
}

function buildQueryParams() {
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

  if (selectedRadio) {
    const filterMap = {
      All: 'ALL',
      In: 'IN',
      Out: 'OUT',
      Adjust: 'ADJUSTMENT',
      Transfer: 'TRANSFER',
    };
    const type = filterMap[selectedRadio.id];

    if (type && type !== 'ALL') {
      params.append('type', type);
    }
  }

  return params.toString() ? `?${params.toString()}` : '';
}

// Filter transactions based on user role and warehouses
function filterTransactions(allTransactions, user, warehouses) {
  if (user.role === 'manager') {
    return allTransactions.filter((transaction) => {
      return warehouses.some(
        (warehouse) =>
          (transaction.sourceWarehouse &&
            transaction.sourceWarehouse._id === warehouse._id) ||
          (transaction.destinationWarehouse &&
            transaction.destinationWarehouse._id === warehouse._id)
      );
    });
  } else {
    return allTransactions;
  }
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
        const id = event.target.value;
        const result = await api.get(
          `${config.TRANSACTION_BASE_URL}/generate-invoice/${id}`,
          { responseType: 'blob' }
        );

        const blob = new Blob([result.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const pdfLink = document.createElement('a');
        pdfLink.href = url;
        pdfLink.download = 'invoice.pdf';
        pdfLink.click();

        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
      }
    });
  });
}

export default transactionDetailsLoad;
