import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/transactionDetailsTemplate.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get userid of the current user
    const response = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const userId = response.data.data.user._id;

    const transactionTemplate = new TransactionDetailsTemplate();

    // get warehouses of a specific user
    const warehouseDetails = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/${userId}`
    );
    const userSpecificWarehouses = warehouseDetails.data.data.filter(
      (warehouse) => warehouse.active === true
    );
    console.log(userSpecificWarehouses);

    userSpecificWarehouses.forEach((warehouse) => {
      document.querySelector('.warehouses-options').innerHTML +=
        transactionTemplate.warehouseOptions(warehouse);
    });

    // Get all transactions
    const result = await api.get(`${config.TRANSACTION_BASE_URL}/`);

    const transactions = result.data.data;

    let allTransactions = transactions;

    // Invoice for OUT transactions
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

            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.pdf';
            a.click();

            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error(err);
          }
        });
      });
    }

    // Render function
    function renderTransactions(filterType = 'ALL') {
      reportSelection.reportSection.innerHTML = ''; // clear current list

      allTransactions
        .filter((t) => filterType === 'ALL' || t.type === filterType)
        .forEach((t) => {
          let report;

          switch (t.type) {
            case 'IN':
              report = transactionTemplate.stockInDetails(t);
              break;
            case 'OUT':
              report = transactionTemplate.stockOutDetails(t);
              break;
            case 'ADJUSTMENT':
              report = transactionTemplate.stockAdjustDetails(t);
              break;
            case 'TRANSFER':
              report = transactionTemplate.stockTransferDetails(t);
              break;
            default:
              console.log('Unknown Type');
          }

          reportSelection.reportSection.innerHTML += report;
        });
      attachInvoiceListeners();
    }

    // Initial render
    renderTransactions();

    // Listen for radio button changes
    document.querySelectorAll('input[name="btnradio"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const filterType = radio.id.replace('btnradio', '');
        // IDs: All, In, Out, Transfer, Adjust → map properly

        let filterMap = {
          All: 'ALL',
          In: 'IN',
          Out: 'OUT',
          Adjust: 'ADJUSTMENT',
          Transfer: 'TRANSFER',
        };

        renderTransactions(filterMap[filterType]);
      });
    });
  } catch (err) {
    console.error(err);
  }
});
