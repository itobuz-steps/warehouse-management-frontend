import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import {
  verifiedManagerCard,
  unverifiedManagerCard,
} from '../../common/template/profileTemplate.js';
import addWarehouseDetails from '../../common/template/warehouseDetailsTemplate.js';
import { getUserWarehouses } from '../../common/api/HelperApi.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

export const getUserDetailsSubscribe = async () => {
  try {
    const res = await api.get(`${config.PROFILE_BASE_URL}/`);

    const user = res.data.data.user;

    const verifiedManagers = res.data.data.verifiedManagers;
    const unverifiedManagers = res.data.data.unverifiedManagers;

    userManagementSelection.userName.innerText = user.name;
    userManagementSelection.userEmail.innerHTML += `<i class="fa-solid fa-envelope mail"></i> ${user.email}`;
    userManagementSelection.userImg.src =
      user.profileImage || '../../../assets/images/profile_default.svg';
    userManagementSelection.userRole.innerText = user.role;
    userManagementSelection.createdAt.innerText = new Date(
      user.createdAt
    ).toLocaleDateString();
    userManagementSelection.updatedAt.innerText = new Date(
      user.updatedAt
    ).toLocaleDateString();

    document.querySelector('#name').value = user.name;

    userManagementSelection.userRole.style.textTransform = 'capitalize';

    if (verifiedManagers.length != 0) {
      verifiedManagers.forEach((manager) => {
        let card;

        if (!manager.profileImage) {
          card = verifiedManagerCard(manager.name, manager.email);
        } else {
          card = verifiedManagerCard(
            manager.name,
            manager.email,
            manager.profileImage
          );
        }

        userManagementSelection.verifiedManagerGrid.innerHTML += card;
      });
    }

    if (unverifiedManagers.length != 0) {
      unverifiedManagers.forEach((manager) => {
        const card = unverifiedManagerCard(manager.email);

        userManagementSelection.notVerifiedManagerGrid.innerHTML += card;
      });
    }

    if (user.role === 'manager') {
      userManagementSelection.managerView.forEach((element) => {
        element.style.display = 'none';
      });

      userManagementSelection.warehouseDetailsSelection.style.display = 'block';

      const warehouses = await getUserWarehouses();

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
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export const updateUserSubscribe = async (event) => {
  event.preventDefault();
  const formData = new FormData(userManagementSelection.updateProfileForm);
  try {
    await api.patch(`${config.PROFILE_BASE_URL}/update-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    console.log(err);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
    window.location.reload();
  }
};

export const deleteUserSubscribe = async () => {
  try {
    const res = await api.delete(`${config.PROFILE_BASE_URL}/`);

    console.log(res);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};
