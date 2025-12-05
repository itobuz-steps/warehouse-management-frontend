import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';

const displayToast = new Templates();

export const deleteUserSubscribe = async () => {
  try {
    await api.delete(`${config.PROFILE_BASE_URL}/`);
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
