import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import clearProfileData from './clearProfileDetails.js';
// import addWarehouseDetails from '../../common/template/warehouseDetailsTemplate.js';
// import { getUserWarehouses } from '../../common/api/HelperApi.js';

import {
  managerCard,
  unverifiedManagerCard,
  emptyCard,
} from '../../common/template/profileTemplate.js';

const displayToast = new Templates();

export const getUserDetailsSubscribe = async () => {
  try {
    let blockedManagerCount = 0;
    let activeManagerCount = 0;

    const res = await api.get(`${config.PROFILE_BASE_URL}/`);
    const user = res.data.data.user;

    const verifiedManagers = res.data.data.verifiedManagers;
    const unverifiedManagers = res.data.data.unverifiedManagers;

    clearProfileData();

    //profile operations
    userManagementSelection.userName.innerHTML = user.name; //set name to profile card
    userManagementSelection.userRole.innerHTML = user.role; //set role to profile card
    userManagementSelection.userRole.style.textTransform = 'capitalize'; // make role capitalize

    userManagementSelection.userEmail.innerHTML += `<i class="fa-solid fa-envelope mail"></i> ${user.email}`; // set email to profile card
    userManagementSelection.profileAvatar.style.backgroundImage = `url(${user.profileImage})`; // profile card image label
    userManagementSelection.userImg.src = user.profileImage; // profile card modal open avatar

    userManagementSelection.createdAt.innerHTML = new Date(
      user.createdAt
    ).toDateString();
    userManagementSelection.updatedAt.innerHTML = new Date(
      user.updatedAt
    ).toDateString();
    userManagementSelection.lastLogin.innerHTML = new Date(
      user.lastLogin
    ).toDateString();

    // manage active and blocked users
    if (verifiedManagers.length) {
      verifiedManagers.forEach((manager) => {
        const lastLogin = new Date(manager.lastLogin).toLocaleDateString();
        const createdOn = new Date(manager.createdAt).toLocaleDateString();

        if (manager.isActive) {
          activeManagerCount += 1;

          const card = managerCard(
            manager._id,
            manager.name,
            manager.email,
            lastLogin,
            createdOn,
            manager.isActive,
            manager.profileImage
          );

          userManagementSelection.activeManagerGrid.innerHTML += card;
        } else {
          blockedManagerCount += 1;

          const card = managerCard(
            manager._id,
            manager.name,
            manager.email,
            lastLogin,
            createdOn,
            manager.isActive,
            manager.profileImage
          );

          userManagementSelection.blockedManagerGrid.innerHTML += card;
        }
      });
    }

    if (!blockedManagerCount) {
      userManagementSelection.blockedManagerGrid.innerHTML = emptyCard();
    }

    if (!activeManagerCount) {
      userManagementSelection.activeManagerGrid.innerHTML = emptyCard();
    }

    // manage pending managers
    if (unverifiedManagers.length) {
      unverifiedManagers.forEach((manager) => {
        const createdOn = new Date(manager.createdAt).toLocaleDateString();

        const card = unverifiedManagerCard(
          manager._id,
          manager.name,
          manager.email,
          createdOn,
          manager.profileImage
        );

        userManagementSelection.pendingManagerGrid.innerHTML += card;
      });
    } else {
      userManagementSelection.pendingManagerGrid.innerHTML = emptyCard();
    }

    // if (user.role === 'manager') {
    //   userManagementSelection.managerView.forEach((element) => {
    //     element.style.display = 'none';
    //   });

    //   userManagementSelection.warehouseDetailsSelection.style.display = 'block';
    //   document.getElementById('adminToggle').style.display = 'none';

    //   const warehouses = await getUserWarehouses();

    //   if (!warehouses.length) {
    //     userManagementSelection.noWarehouseParagraph.style.display = 'block';
    //     userManagementSelection.noWarehouseParagraph.innerText = `No warehouse assigned yet!`;
    //     return;
    //   }

    //   userManagementSelection.noWarehouseParagraph.style.display = 'none';
    //   warehouses.forEach(async (warehouse) => {
    //     const res = await api.get(
    //       `${config.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${warehouse._id}`
    //     );
    //     const capacityPercentage = res.data.data.percentage;
    //     let text;

    //     if (capacityPercentage < 50) {
    //       text = 'LOW';
    //     } else if (capacityPercentage >= 50 && capacityPercentage <= 80) {
    //       text = 'MODERATE';
    //     } else if (capacityPercentage > 80) {
    //       text = 'HIGH';
    //     }

    //     userManagementSelection.warehouseGrid.innerHTML += addWarehouseDetails(
    //       warehouse,
    //       text
    //     );
    //   });
    // }
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
