import * as bootstrap from 'bootstrap';

import userManagementSelection from './userManagementSelector.js';
import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import Templates from '../../common/Templates.js';

const displayToast = new Templates();
const addManagerModal = document.getElementById('addManagerModal');
const addManagerModalObj = new bootstrap.Modal(addManagerModal);

export default async function sendInvite(event) {
  try {
    event.preventDefault();

    const managerFormData = new FormData(event.target);
    const email = managerFormData.get('email');

    const response = await api.post(`${config.AUTH_BASE_URL}/signup`, {
      email,
    });

    addManagerModalObj.hide();
    userManagementSelection.addManagerForm.reset();

    userManagementSelection.toastSection.innerHTML = displayToast.successToast(
      response.data.message
    );
  } catch (err) {
    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.response.data.message
    );
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
}

async function sendInviteAgain(email) {
  try {
    const response = await api.post(`${config.AUTH_BASE_URL}/signup`, {
      email,
    });

    userManagementSelection.toastSection.innerHTML = displayToast.successToast(
      response.data.message
    );
  } catch (err) {
    userManagementSelection.toastSection.innerHTML = displayToast.errorToast(
      err.response.data.message
    );
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
}

window.sendInviteAgain = sendInviteAgain;
