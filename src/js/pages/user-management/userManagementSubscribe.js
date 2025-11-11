import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import {
  verifiedManagerCard,
  unverifiedManagerCard,
} from '../../common/template/profileTemplate.js';

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
    console.log(unverifiedManagers);

    userManagementSelection.userName.innerText = user.name;
    userManagementSelection.userEmail.innerText = user.email;
    userManagementSelection.userImg.src = user.profileImage;
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
        let card;

        if (!manager.profileImage) {
          card = unverifiedManagerCard(manager.email);
        } else {
          card = unverifiedManagerCard(manager.email);
        }

        userManagementSelection.notVerifiedManagerGrid.innerHTML += card;
      });
    }

    if(user.role === 'manager') {
      userManagementSelection.managerView.forEach(element => {
        element.style.display = 'none';
      });
    }
    
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    console.log(err);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export const updateUserSubscribe = async () => {
  try {
    const res = await api.patch(`${config.PROFILE_BASE_URL}/update-profile`);
    console.log(res);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
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
