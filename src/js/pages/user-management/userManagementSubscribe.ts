import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import displayProfile from './displayProfileDetails.js';
import addWarehouseDetails from '../../common/template/warehouseDetailstemplate.js';
import { getUserWarehouses } from '../../common/api/helperApi.js';
import {
  displayVerifiedManagerCard,
  displayPendingManagerCard,
} from './displayAdminDetails.js';

const displayToast = new Templates();

export const getUserDetailsSubscribe = async () => {
  try {
    const res = await api.get(`${config.PROFILE_BASE_URL}/`);
    const user = res.data.data.user;
    const verifiedManagers = res.data.data.verifiedManagers;
    const unverifiedManagers = res.data.data.unverifiedManagers;

    displayProfile(user);

    if (user.role === 'admin') {
      userManagementSelection.addManagerBtn.classList.remove('d-none');
      userManagementSelection.toggleBtns.classList.remove('d-none');

      displayVerifiedManagerCard(verifiedManagers);
      displayPendingManagerCard(unverifiedManagers);
    } else if (user.role === 'manager') {
      userManagementSelection.warehouseSection.classList.remove('d-none');
      document.getElementById('managerTitle')?.classList.remove('d-none');

      const warehouses = await getUserWarehouses();

      if (!warehouses.length) {
        userManagementSelection.warehouseSection.innerHTML = `No warehouse assigned yet`;
      }

      warehouses.forEach(async (warehouse) => {
        const res = await api.get(
          `${config.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${warehouse._id}`
        );

        const capacityPercentage = res.data.data.percentage;

        let text: string = 'LOW';

        if (capacityPercentage < 50) {
          text = 'LOW';
        } else if (capacityPercentage >= 50 && capacityPercentage <= 80) {
          text = 'MODERATE';
        } else if (capacityPercentage > 80) {
          text = 'HIGH';
        }

        userManagementSelection.warehouseSection.innerHTML +=
          addWarehouseDetails(warehouse, text);
      });
    }
  } catch (err) {
    if (!(err instanceof Error)) {
      console.error(err);
      return;
    }

    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};
