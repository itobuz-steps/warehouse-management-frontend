import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/transactionDetailsTemplate.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/HelperApi.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

async function transactionDetailsLoad() {
  try {
    const user = await getCurrentUser();

    const transactionTemplate = new TransactionDetailsTemplate();

    // get user specific warehouses
    let warehouses = await getUserWarehouses();

    const dropdown = document.querySelector('.warehouses-options');

    // Add default ALL option
    dropdown.innerHTML = `
      <li>
        <a class="dropdown-item warehouse-option active" data-id="ALL">All Warehouses</a>
      </li>
    `;

    // Render user warehouses
    warehouses.forEach((warehouse) => {
      dropdown.innerHTML += transactionTemplate.warehouseOptions(warehouse);
    });

    // Attach click listeners
    attachWarehouseFilter();

    // Load ALL transactions by default
    loadTransactions('ALL');

    // Warehouse dropdown option click
    function attachWarehouseFilter() {
      document.querySelectorAll('.warehouse-option').forEach((option) => {
        option.addEventListener('click', () => {
          const id = option.getAttribute('data-id');
          reportSelection.dropdownBtn.textContent = option.textContent.trim();

          document.querySelectorAll('.warehouse-option').forEach((opt) => {
            opt.classList.remove('active');
          });

          option.classList.add('active');

          // Select ALL radio button
          const allRadio = document.querySelector('#All');
          if (allRadio) {
            allRadio.checked = true;
            const event = new Event('change');
            allRadio.dispatchEvent(event);
          }

          loadTransactions(id);
        });
      });
    }

    // Load the transactions in the page
    async function loadTransactions(warehouseId) {
      let result;

      if (warehouseId === 'ALL') {
        // Load ALL warehouse transactions
        result = await api.get(`${config.TRANSACTION_BASE_URL}/`);
      } else {
        // Load warehouse-specific transactions
        result = await api.get(
          `${config.TRANSACTION_BASE_URL}/warehouse-specific-transaction/${warehouseId}`
        );
      }

      let allModifiedTransactions = result.data.data;
      let allTransactions = [];

      // Check for warehouseIds with transaction's warehouse Ids
      if (user.role === 'manager') {
        allModifiedTransactions.forEach((transaction) => {
          let flag = false;
          for (let warehouse of warehouses) {
            if (
              (transaction.sourceWarehouse &&
                transaction.sourceWarehouse._id === warehouse._id) ||
              (transaction.destinationWarehouse &&
                transaction.destinationWarehouse._id === warehouse._id)
            ) {
              flag = true;
              break;
            }
          }
          if (flag) {
            allTransactions.push(transaction);
          }
        });
      } else {
        allTransactions = allModifiedTransactions;
      }

      // Main render function
      function renderTransactions(filterType = 'ALL') {
        let filtered = allTransactions.filter(
          (transaction) =>
            filterType === 'ALL' || transaction.type === filterType
        );
        renderTransactionsList(filtered);
      }

      // Populate UI with generated HTML
      function renderTransactionsList(transactions) {
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

      // Load first time for default all types
      renderTransactions();

      // Filter by type (radio buttons)
      document.querySelectorAll('input[name="btnradio"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          let filterMap = {
            All: 'ALL',
            In: 'IN',
            Out: 'OUT',
            Adjust: 'ADJUSTMENT',
            Transfer: 'TRANSFER',
          };

          renderTransactions(filterMap[radio.id]);
        });
      });

      // Invoice listener
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
    }
  } catch (err) {
    console.error(err);
  }
}

export default transactionDetailsLoad;
