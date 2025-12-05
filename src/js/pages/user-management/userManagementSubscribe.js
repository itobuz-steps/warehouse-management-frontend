import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import {
  verifiedManagerCard,
  unverifiedManagerCard,
  emptyCard,
} from '../../common/template/profileTemplate.js';
import clearProfileData from './clearProfileDetails.js';
import addWarehouseDetails from '../../common/template/warehouseDetailsTemplate.js';
import { getUserWarehouses } from '../../common/api/HelperApi.js';

const displayToast = new Templates();

export const getUserDetailsSubscribe = async () => {
  try {
    const res = await api.get(`${config.PROFILE_BASE_URL}/`);
    const user = res.data.data.user;
    const verifiedManagers = res.data.data.verifiedManagers;
    const unverifiedManagers = res.data.data.unverifiedManagers;

    clearProfileData();

    userManagementSelection.userName.innerHTML = user.name;
    userManagementSelection.userRole.innerHTML = user.role;

    userManagementSelection.name.value = user.name;
    userManagementSelection.userRole.style.textTransform = 'capitalize';

    userManagementSelection.userEmail.innerHTML += `<i class="fa-solid fa-envelope mail"></i> ${user.email}`;
    userManagementSelection.userImg.src =
      user.profileImage || '../../../assets/images/profile_default.svg';

    userManagementSelection.createdAt.innerHTML = new Date(
      user.createdAt
    ).toDateString();

    userManagementSelection.updatedAt.innerHTML = new Date(
      user.updatedAt
    ).toDateString();

    userManagementSelection.lastLogin.innerHTML = new Date(
      user.lastLogin
    ).toDateString();

    if (verifiedManagers.length) {
      verifiedManagers.forEach((manager) => {
        const lastLogin = new Date(manager.lastLogin).toLocaleDateString();

        const card = verifiedManagerCard(
          manager.name,
          manager.email,
          lastLogin,
          manager.isActive,
          manager.profileImage
        );

        userManagementSelection.verifiedManagerGrid.innerHTML += card;
      });
    } else {
      userManagementSelection.verifiedManagerGrid.innerHTML = emptyCard();
    }

    if (unverifiedManagers.length) {
      unverifiedManagers.forEach((manager) => {
        const card = unverifiedManagerCard(manager.email);

        userManagementSelection.notVerifiedManagerGrid.innerHTML += card;
      });
    } else {
      userManagementSelection.notVerifiedManagerGrid.innerHTML = emptyCard();
    }

    if (user.role === 'manager') {
      userManagementSelection.managerView.forEach((element) => {
        element.style.display = 'none';
      });

      userManagementSelection.warehouseDetailsSelection.style.display = 'block';

      const warehouses = await getUserWarehouses();

      if (!warehouses.length) {
        userManagementSelection.noWarehouseParagraph.style.display = 'block';
        userManagementSelection.noWarehouseParagraph.innerText = `No warehouse assigned yet!`;
        return;
      }

      userManagementSelection.noWarehouseParagraph.style.display = 'none';
      warehouses.forEach(async (warehouse) => {
        const res = await api.get(
          `${config.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${warehouse._id}`
        );
        const capacityPercentage = res.data.data.percentage;
        let text;

        if (capacityPercentage < 50) {
          text = 'LOW';
        } else if (capacityPercentage >= 50 && capacityPercentage <= 80) {
          text = 'MODERATE';
        } else if (capacityPercentage > 80) {
          text = 'HIGH';
        }

        userManagementSelection.warehouseGrid.innerHTML += addWarehouseDetails(
          warehouse,
          text
        );
      });
    }
  } catch (err) {
    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};
