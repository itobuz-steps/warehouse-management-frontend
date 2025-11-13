import Templates from '../../common/Templates.js';
import WarehouseTemplate from '../../common/template/WarehouseTemplate.js';
import api from '../../api/interceptor';
import config from '../../config/config';

const displayToast = new Templates();
const displayRows = new WarehouseTemplate();
const toastSection = document.getElementById('toastSection');
const rowsContainer = document.getElementById('warehouseTable');

export async function displayWarehouse() {
  try {
    const warehouseDetails = await api.get(
      `${config.ADMIN_BASE_URL}/get-warehouses`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    const rows = warehouseDetails.data.data;

    if (!rows) {
      rowsContainer.innerHTML = displayRows.emptyWarehouse();
    }

    console.log(rows);
    rowsContainer.innerHTML = '';

    for (let i = rows.length - 1; i > 0; i--) {
      if (rows[i].active) {
        rowsContainer.innerHTML += displayRows.activeWarehouse(rows[i]);
      } else {
        rowsContainer.innerHTML += displayRows.inactiveWarehouse(rows[i]);
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
