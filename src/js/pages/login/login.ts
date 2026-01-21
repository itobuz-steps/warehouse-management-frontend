import '../../../scss/auth.scss';
// @ts-expect-error bootstrap need to be imported this way
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

import loginSelection from './loginSelector.ts';
import loginSubscribe from './loginSubscribe.ts';
import { showPassToggle } from '../../common/showPasswordToggle';

loginSelection.loginForm.addEventListener('submit', loginSubscribe);

const passwordToggle = document.getElementById(
  'togglePassword'
) as HTMLButtonElement;

passwordToggle.addEventListener('click', () => {
  const newPasswordInput = document.getElementById(
    'password'
  ) as HTMLInputElement;

  showPassToggle(newPasswordInput);
});
