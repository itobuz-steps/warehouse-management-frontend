import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';

const displayToast = new Templates();

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
    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};
