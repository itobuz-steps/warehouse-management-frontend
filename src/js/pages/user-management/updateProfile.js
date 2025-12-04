import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import { getUserDetailsSubscribe } from './userManagementSubscribe.js';
import * as bootstrap from 'bootstrap';

const displayToast = new Templates();
const updateModal = document.getElementById('updateProfileModal');
const updateModalObj = new bootstrap.Modal(updateModal);
const updateSpinner = document.getElementById('updateSpinner');

export const updateUserSubscribe = async (event) => {
  event.preventDefault();
  const formData = new FormData(userManagementSelection.updateProfileForm);
  try {
    await api.patch(`${config.PROFILE_BASE_URL}/update-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    updateSpinner.classList.remove('d-none');

    await getUserDetailsSubscribe();
    updateModalObj.hide();
    userManagementSelection.updateProfileForm.reset();
    updateSpinner.classList.add('d-none');
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
