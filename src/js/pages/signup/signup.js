import '../../../scss/auth.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import config from '../../../config/config.js';
import signupSelection from './signupSelector.js';
import signupSubscribe from './signupSubscribe.js';

const signupContainer = document.getElementById('signupContainer');
const unauthorizedMessage = document.getElementById('unauthorizedMessage');
const expiredMessage = document.getElementById('expiredMessage');
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  unauthorizedMessage.classList.remove('d-none');
} else {
  signupContainer.classList.remove('d-none');
  tokenValidator(token);
}

signupSelection.signupForm.addEventListener('submit', signupSubscribe);

async function tokenValidator(token) {
  try {
    const response = await axios.post(
      `${config.AUTH_BASE_URL}/signup/${token}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    if (err.response.data.message == 'Link Expired') {
      expiredMessage.classList.remove('d-none');
      signupContainer.classList.add('d-none');
    }
  }
}

export default token;
