import '../../../scss/auth.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import loginSelection from './loginSelector';
import loginSubscribe from './loginSubscribe';
import { showPassToggle } from '../../common/showPasswordToggle';

loginSelection.loginForm.addEventListener('submit', loginSubscribe);

const passwordToggle = document.getElementById('togglePassword');

passwordToggle.addEventListener('click', () => {
  showPassToggle('password');
});
