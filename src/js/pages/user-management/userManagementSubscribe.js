import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

export const getUserDetailsSubscribe = async () => {
  try {
    const res = await api.get(`${config.PROFILE_BASE_URL}/`);
    console.log(res);

    const user = res.data.user;
    const managers = res.data.managerData;
    console.log(managers);

    userManagementSelection.userName.innerText = user.name;
    userManagementSelection.userEmail.innerText = user.email;
    userManagementSelection.userImg.src = user.profileImage;
    userManagementSelection.userRole.innerText = user.role;
    userManagementSelection.userRole.style.textTransform = 'capitalize';

    toastSection.innerHTML = displayToast.successToast(res.data.message);
    
    const managerTemplate = ``

    if(managers.length != 0){
      managers.forEach(manager => {
        
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
