import api from '../../api/interceptor.js';
import TransactionDetailsTemplate from '../../common/template/transactionDetailsTemplate.js';
import config from '../../config/config.js';
import reportSelection from './reportsSelectors.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await api.get(`${config.TRANSACTION_BASE_URL}/`);

    const transactions = result.data.data;
    console.log(transactions);
    const transactionTemplate = new TransactionDetailsTemplate();

    transactions.forEach((transaction) => {
      let report;

      if (transaction.type === 'IN') {
        report = transactionTemplate.stockInDetails(transaction);
      } else if (transaction.type === 'OUT') {
        report = transactionTemplate.stockOutDetails(transaction);
      } else if (transaction.type === 'ADJUSTMENT') {
        report = transactionTemplate.stockAdjustDetails(transaction);
      } else if (transaction.type === 'TRANSFER') {
        report = transactionTemplate.stockTransferDetails(transaction);
      } else {
        console.log('Unknown Type');
      }
      reportSelection.reportSection.innerHTML += report;
    });
  } catch (err) {
    console.error(err);
  }
});
