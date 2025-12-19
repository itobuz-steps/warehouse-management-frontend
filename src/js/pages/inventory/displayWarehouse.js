import Templates from '../../common/Templates.js';
import WarehouseTemplate from '../../common/template/WarehouseTemplate.js';
import api from '../../api/interceptor';
import config from '../../config/config';

const displayToast = new Templates();
const displayRows = new WarehouseTemplate();
const toastSection = document.getElementById('toastSection');
const rowsContainer = document.getElementById('warehouseCards');

export async function displayWarehouse() {
  try {
    const warehouseDetails = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/`
    );

    const rows = warehouseDetails.data.data;
    console.log(rows);

    rowsContainer.innerHTML = '';

    if (!rows || rows.length === 0) {
      rowsContainer.innerHTML = displayRows.emptyWarehouse();
      return;
    }

    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].active) {
        rowsContainer.innerHTML += displayRows.activeWarehouse(rows[i]);
      }
    }
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}
