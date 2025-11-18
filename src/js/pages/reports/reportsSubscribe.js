import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/transactionDetailsTemplate.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

async function transactionDetailsLoad() {
  try {
    // Get logged-in user ID
    const response = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const userId = response.data.data.user._id;

    const transactionTemplate = new TransactionDetailsTemplate();

    // get user specific warehouses
    let warehouseDetails = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/${userId}`
    );

    // Get all active warehouses
    const userSpecificWarehouses = warehouseDetails.data.data.filter(
      (warehouse) => warehouse.active === true
    );

    const dropdown = document.querySelector('.warehouses-options');

    // Add default ALL option
    dropdown.innerHTML = `
      <li>
        <a class="dropdown-item warehouse-option" data-id="ALL">All Warehouses</a>
      </li>
    `;

    // Render user warehouses
    userSpecificWarehouses.forEach((warehouse) => {
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
          loadTransactions(id);

          // Update selected label if exists
          const label = document.querySelector('.selected-warehouse-label');
          if (label) {
            label.innerText = option.innerText;
          }
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
      if (response.data.data.user.role === 'manager') {
        console.log(userSpecificWarehouses);
        console.log(allModifiedTransactions);

        allModifiedTransactions.forEach((transaction) => {
          let flag = false;
          userSpecificWarehouses.forEach((warehouse) => {
            if (
              transaction.sourceWarehouse &&
              transaction.sourceWarehouse !== null &&
              transaction.sourceWarehouse._id === warehouse._id
            ) {
              flag = true;
            }
            if (
              transaction.destinationWarehouse &&
              transaction.destinationWarehouse !== null &&
              transaction.destinationWarehouse._id === warehouse._id
            ) {
              flag = true;
            }
            if (flag) {
              allTransactions.push(transaction);
            }
            flag = false;
          });
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
