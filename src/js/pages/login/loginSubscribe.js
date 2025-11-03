import axios from 'axios';
import config from '../../../config/config.js';

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
  } catch (err) {
    console.log(err);
  }
};

export default loginSubscribe;
