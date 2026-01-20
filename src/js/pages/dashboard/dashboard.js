import '../../../scss/styles.scss';
import '../../../scss/dashboard.scss';

//@ts-expect-error Bootstrap import
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import dashboardSelection from './dashboardSelector';
import { addManagerSubscribe } from './adminSubscribe.js';
import {
  showTopProductsSubscribe,
  showInventoryCategorySubscribe,
  showProductTransactionSubscribe,
  fetchUserAndWarehouses,
  showTransactionStatsSubscribe,
  showRecentTransactions,
  showLowStockProducts,
  loadMostCancelledProducts,
  showTopSellingProductsSubscribe,
  loadMostAdjustedProducts,
  showProfitLossSubscribe,
  transactionExportSubscribe,
  categoryExportSubscribe,
  topFiveExportSubscribe,
} from './dashboardSubscribe.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);

document.addEventListener('DOMContentLoaded', async () => {
  const warehouse = await fetchUserAndWarehouses(
    dashboardSelection.warehouseSelect
  );

  //if user has warehouses assigned.
  if (warehouse) {
    const firstWarehouse = dashboardSelection.warehouseSelect.value;
    await showTopProductsSubscribe(firstWarehouse);
    await showInventoryCategorySubscribe(firstWarehouse);
    await showProductTransactionSubscribe(firstWarehouse);
    await showTransactionStatsSubscribe(firstWarehouse);
    await showLowStockProducts(firstWarehouse);
    await loadMostCancelledProducts(firstWarehouse);
    await loadMostAdjustedProducts(firstWarehouse);
    await showRecentTransactions(firstWarehouse);
    await showTopSellingProductsSubscribe(firstWarehouse);
    await showProfitLossSubscribe(firstWarehouse, 'week');

    dashboardSelection.dateGroup.style.display = 'none';
  }
});

dashboardSelection.warehouseSelect.addEventListener('change', async () => {
  dashboardSelection.weekly.checked = true;

  // Hide custom date inputs
  dashboardSelection.dateGroup.style.display = 'none';
  dashboardSelection.fromInput.value = '';
  dashboardSelection.toInput.value = '';

  const selectedWarehouseId = dashboardSelection.warehouseSelect.value;
  await showTopProductsSubscribe(selectedWarehouseId);
  await showInventoryCategorySubscribe(selectedWarehouseId);
  await showProductTransactionSubscribe(selectedWarehouseId);
  await showTransactionStatsSubscribe(selectedWarehouseId);
  await showLowStockProducts(selectedWarehouseId);
  await loadMostCancelledProducts(selectedWarehouseId);
  await loadMostAdjustedProducts(selectedWarehouseId);
  await showRecentTransactions(selectedWarehouseId);
  await showTopSellingProductsSubscribe(selectedWarehouseId);
  await showProfitLossSubscribe(selectedWarehouseId, 'week');

  const selectedMode = document.querySelector(
    'input[name="mode"]:checked'
  ).value;

  if (selectedMode === 'custom') {
    dateGroup.style.display = 'flex';
    // reload custom chart only if both dates selected
    if (fromInput.value && toInput.value) {
      await showProfitLossSubscribe(
        selectedWarehouseId,
        null,
        fromInput.value,
        toInput.value
      );
    }
  } else {
    dateGroup.style.display = 'none';
    await showProfitLossSubscribe(selectedWarehouseId, selectedMode);
  }
});

dashboardSelection.topFiveExport.addEventListener(
  'click',
  topFiveExportSubscribe
);

dashboardSelection.categoryExport.addEventListener(
  'click',
  categoryExportSubscribe
);

dashboardSelection.transactionsExport.addEventListener(
  'click',
  transactionExportSubscribe
);

// Show/hide date inputs based on mode
const modeRadios = dashboardSelection.modeRadios;
const dateGroup = dashboardSelection.dateGroup;
const fromInput = dashboardSelection.fromInput;
const toInput = dashboardSelection.toInput;

const handleModeChange = async () => {
  const selectedMode = document.querySelector(
    'input[name="mode"]:checked'
  ).value;
  const warehouseId = dashboardSelection.warehouseSelect.value;

  if (selectedMode === 'custom') {
    dateGroup.style.display = 'flex'; // show date inputs
  } else {
    dateGroup.style.display = 'none';
    await showProfitLossSubscribe(warehouseId, selectedMode);
  }
};

// Attach listener to radio buttons
modeRadios.forEach((radio) => {
  radio.addEventListener('change', handleModeChange);
});

// Handle custom date range submit (or on date change)
const handleCustomDateChange = async () => {
  const warehouseId = dashboardSelection.warehouseSelect.value;
  const from = fromInput.value;
  const to = toInput.value;

  if (!from || !to) {
    return; // wait until both dates selected
  }
  await showProfitLossSubscribe(warehouseId, null, from, to); // pass from/to
};

fromInput.addEventListener('change', handleCustomDateChange);
toInput.addEventListener('change', handleCustomDateChange);
