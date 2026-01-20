import Templates from '../../common/Templates.js';
import WarehouseTemplate from '../../common/template/WarehouseTemplate.js';
import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import inventorySelection from './inventorySelector.js';

const displayToast = new Templates();
const warehouseTemplate = new WarehouseTemplate();

export async function displayWarehouse() {
  try {
    const res = await api.get(`${config.WAREHOUSE_BASE_URL}/get-warehouses`);

    const warehouses = res.data.data;

    if (!warehouses || warehouses.length === 0) {
      inventorySelection.warehouseCards.innerHTML =
        warehouseTemplate.emptyWarehouse();
      return;
    }

    let html = '';

    for (const warehouse of warehouses) {
      let storagePercentage = null;

      try {
        const capacityRes = await api.get(
          `${config.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${warehouse._id}`
        );
        storagePercentage = capacityRes.data.data.percentage;
      } catch {
        console.log(`Capacity fetch failed for warehouse ${warehouse._id}`);
      }

      html += warehouseTemplate.activeWarehouse({
        ...warehouse,
        storagePercentage,
      });
    }
    inventorySelection.warehouseCards.innerHTML = html;
  } catch (err) {
    inventorySelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
  } finally {
    setTimeout(() => {
      inventorySelection.toastSection.innerHTML = '';
    }, 3000);
  }
}
