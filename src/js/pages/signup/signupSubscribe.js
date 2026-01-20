import { config } from '../../config/config.js';
import axios from 'axios';
import token from './signup';
import { Templates } from '../../common/Templates.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

const signupSubscribe = async (event) => {
  try {
    event.preventDefault();

    const signupFormData = new FormData(event.target);
    const name = signupFormData.get('name');
    const password = signupFormData.get('password');
    const signupData = { name, password };

    const response = await axios.post(
      `${config.AUTH_BASE_URL}/signup/set-password/${token}`,
      signupData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    toastSection.innerHTML = displayToast.successToast(response.data.message);

    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 1000);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.response.data.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export default signupSubscribe;
