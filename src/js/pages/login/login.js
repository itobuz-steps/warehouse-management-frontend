import '../../../scss/auth.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import loginSelection from './loginSelector';
import loginSubscribe from './loginSubscribe';

loginSelection.loginForm.addEventListener('submit', loginSubscribe);

const passwordToggle = document.getElementById('togglePassword');

passwordToggle.addEventListener('click', showPassToggle);

function showPassToggle() {
  const passwordInput = document.getElementById('password');
  const icon = this.querySelector('i');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}
