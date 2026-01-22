import axios, { AxiosError } from 'axios';
import { config } from '../../config/config.js';
import { Templates } from '../../common/Templates.js';
import { registerAndSubscribe } from '../../common/notifications/notificationSubscribe.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection') as HTMLDivElement;

const loginSubscribe = async (event: Event) => {
  try {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }
    const loginFormData = new FormData(event.currentTarget);

    const email = loginFormData.get('email');
    const password = loginFormData.get('password');

    const loginData = { email, password };

    const response = await axios.post(
      `${config.AUTH_BASE_URL}/login`,
      loginData
    );

    localStorage.setItem('access_token', response.data.data.accessToken);
    localStorage.setItem('refresh_token', response.data.data.refreshToken);
    await registerAndSubscribe();
    // console.log(subscription);

    toastSection.innerHTML = displayToast.successToast(response.data.message);

    setTimeout(() => {
      window.location.href = '/pages/dashboard.html';
    }, 1000);
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err);
      toastSection.innerHTML = displayToast.errorToast(
        err.response.data.message
      );
    }
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export default loginSubscribe;
