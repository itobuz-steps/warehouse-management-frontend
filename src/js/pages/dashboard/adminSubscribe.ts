import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import { AxiosError } from 'axios';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection')!;

export const addManagerSubscribe = async (event: Event) => {
  try {
    event.preventDefault();

    const managerFormData = new FormData(event.target as HTMLFormElement);
    const email = managerFormData.get('email');

    const response = await api.post(`${config.AUTH_BASE_URL}/signup`, {
      email,
    });

    toastSection.innerHTML = displayToast.successToast(response.data.message);
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      return;
    }

    toastSection.innerHTML = displayToast.errorToast(
      err.response?.data.message
    );
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};
