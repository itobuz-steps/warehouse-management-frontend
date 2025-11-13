import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import {
  verifiedManagerCard,
  unverifiedManagerCard,
} from '../../common/template/profileTemplate.js';
import addWarehouseDetails from '../../common/template/warehouseDetailstemplate.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

export const getUserDetailsSubscribe = async () => {
  try {
    const res = await api.get(`${config.PROFILE_BASE_URL}/`);
    console.log(res);

    const data = res.data.data;

    const user = data.user;
    const verifiedManagers = data.verifiedManagers;
    const unverifiedManagers = data.unverifiedManagers;

    userManagementSelection.userName.innerText = user.name;
    userManagementSelection.userEmail.innerText = user.email;
    userManagementSelection.userImg.src =
      user.profileImage || '../../../assets/images/profile_default.svg';
    userManagementSelection.userRole.innerText = user.role;
    userManagementSelection.createdAt.innerText = new Date(
      user.createdAt
    ).toLocaleDateString();
    userManagementSelection.updatedAt.innerText = new Date(
      user.updatedAt
    ).toLocaleDateString();

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

      const response = await api.get(
        `${config.BASE_URL}warehouse/get-warehouses/${user._id}`
      );

      const warehouses = response.data.data.assignedWarehouses;
      console.log(warehouses);

      warehouses.forEach((warehouse) => {
        userManagementSelection.warehouseGrid.innerHTML +=
          addWarehouseDetails(warehouse);
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
    const res = await api.patch(
      `${config.PROFILE_BASE_URL}/update-profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(res);
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
