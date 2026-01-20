import '../../../scss/auth.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { config } from '../../config/config.js';
import signupSelection from './signupSelector.js';
import signupSubscribe from './signupSubscribe.js';
import { showPassToggle } from '../../common/showPasswordToggle.js';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

signupSelection.togglePassword.addEventListener('click', () => {
  console.log('huh');
  const newPasswordInput = document.getElementById('password');

  showPassToggle(newPasswordInput);
});

if (!token) {
  signupSelection.unauthorizedMessage.classList.remove('d-none');
} else {
  signupSelection.signupContainer.classList.remove('d-none');
  tokenValidator(token);
}

signupSelection.signupForm.addEventListener('submit', signupSubscribe);

async function tokenValidator(token) {
  try {
    await axios.post(`${config.AUTH_BASE_URL}/signup/${token}`);
  } catch (err) {
    if (err.response.data.message == 'Link Expired') {
      signupSelection.expiredMessage.classList.remove('d-none');
      signupSelection.signupContainer.classList.add('d-none');
    }
  }
}

export default token;
