import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import userManagementSelection from './userManagementSelector.js';
import { getUserDetailsSubscribe } from './userManagementSubscribe.js';
import * as bootstrap from 'bootstrap';
import { AxiosError } from 'axios';

const displayToast = new Templates();
const updateModal = document.getElementById('updateProfileModal');

if (!updateModal) {
  throw new Error('Update Profile Modal not found');
}
const updateModalObj = new bootstrap.Modal(updateModal);
const updateSpinner = document.getElementById('updateSpinner');

export const updateUserSubscribe = async (event: Event) => {
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

    updateSpinner?.classList.remove('d-none');

    updateModalObj.hide();
    userManagementSelection.updateProfileForm.reset();
    await getUserDetailsSubscribe();

    updateSpinner?.classList.add('d-none');
    userManagementSelection.toastSection.innerHTML = displayToast.successToast(
      res.data.message
    );
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      console.error(err);
      return;
    }

    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.response?.data.message
    );
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};

export const profileImagePreview = () => {
  const file = userManagementSelection.profileImg.files?.[0];

  userManagementSelection.confirmUpdate.disabled = false;

  if (file) {
    userManagementSelection.profileAvatar.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
  }
};

async function changeStatus(managerId: string) {
  try {
    const response = await api.patch(
      `${config.PROFILE_BASE_URL}/change-user-status/${managerId}`
    );
    await getUserDetailsSubscribe();

    userManagementSelection.toastSection.innerHTML = displayToast.successToast(
      response.data.message
    );
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      console.error(err);
      return;
    }

    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.response?.data.message
    );
  }
}

window.changeStatus = changeStatus;
