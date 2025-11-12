import axios from 'axios';
import config from '../../config/config.js';
import Templates from '../../common/Templates.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

const loginSubscribe = async (event) => {
  try {
    event.preventDefault();
    const loginFormData = new FormData(event.target);

    const email = loginFormData.get('email');
    const password = loginFormData.get('password');

    const loginData = { email, password };

    const response = await axios.post(
      `${config.AUTH_BASE_URL}/login`,
      loginData
    );

    console.log(response);

    localStorage.setItem('access_token', response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);

    toastSection.innerHTML = displayToast.successToast(response.data.message);

    setTimeout(() => {
      window.location.href = '/pages/dashboard.html';
    }, 3000);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.response.data.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export default loginSubscribe;
