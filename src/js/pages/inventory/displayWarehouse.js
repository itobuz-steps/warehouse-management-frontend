import Templates from '../../common/Templates.js';
import WarehouseTemplate from '../../common/template/WarehouseTemplate.js';
import api from '../../api/interceptor';
import config from '../../config/config';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');
const warehouseTemplate = new WarehouseTemplate();
const warehouseCards = document.getElementById('warehouseCards');

export async function displayWarehouse() {
  try {
    const res = await api.get(`${config.WAREHOUSE_BASE_URL}/get-warehouses`);

    const warehouses = res.data.data;

    if (!warehouses || warehouses.length === 0) {
      warehouseCards.innerHTML = warehouseTemplate.emptyWarehouse();
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
    warehouseCards.innerHTML = html;
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    console.log(err)
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}
