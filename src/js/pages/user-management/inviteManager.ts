import * as bootstrap from 'bootstrap';

import userManagementSelection from './userManagementSelector.js';
import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import { AxiosError } from 'axios';

const displayToast = new Templates();
const addManagerModal = document.getElementById(
  'addManagerModal'
) as HTMLElement;
const addManagerModalObj = new bootstrap.Modal(addManagerModal);

export default async function sendInvite(event: Event) {
  try {
    event.preventDefault();

    const managerFormData = new FormData(event.target as HTMLFormElement);
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
}

async function sendInviteAgain(email: string) {
  try {
    const response = await api.post(`${config.AUTH_BASE_URL}/signup`, {
      email,
    });

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
  } finally {
    setTimeout(() => {
      userManagementSelection.toastSection.innerHTML = '';
    }, 3000);
  }
}

window.sendInviteAgain = sendInviteAgain;
