import '../../../scss/auth.scss';
// @ts-expect-error bootstrap need to be imported this way
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { config } from '../../config/config.js';
import signupSelection from './signupSelector.js';
import signupSubscribe from './signupSubscribe.js';
import { showPassToggle } from '../../common/showPasswordToggle.js';
import { AxiosError } from 'axios';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

signupSelection.togglePassword?.addEventListener('click', () => {
  console.log('huh');
  const newPasswordInput = document.getElementById(
    'password'
  ) as HTMLInputElement;

  showPassToggle(newPasswordInput);
});

if (!token) {
  signupSelection.unauthorizedMessage?.classList.remove('d-none');
} else {
  signupSelection.signupContainer?.classList.remove('d-none');
  tokenValidator(token);
}

signupSelection.signupForm?.addEventListener('submit', signupSubscribe);

async function tokenValidator(token: string) {
  try {
    await axios.post(`${config.AUTH_BASE_URL}/signup/${token}`);
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      if (err.response.data.message == 'Link Expired') {
        signupSelection.expiredMessage?.classList.remove('d-none');
        signupSelection.signupContainer?.classList.add('d-none');
      }
    }
  }
}
export default token;
