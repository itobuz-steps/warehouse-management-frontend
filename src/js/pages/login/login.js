import '../../../scss/auth.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import loginSelection from './loginSelector';
import loginSubscribe from './loginSubscribe';

loginSelection.loginForm.addEventListener('submit', loginSubscribe);
