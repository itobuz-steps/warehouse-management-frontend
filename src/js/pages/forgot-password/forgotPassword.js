import '../../../scss/auth.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import forgotPasswordSelection from './forgotPasswordSelector.js';
import ForgotPasswordSubscribe from './ForgotPasswordSubscribe.js';
import { showPassToggle } from '../../common/showPasswordToggle.js';

document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordSubscribe = new ForgotPasswordSubscribe();

  forgotPasswordSelection.emailForm.addEventListener(
    'submit',
    forgotPasswordSubscribe.sendOtp
  );

  forgotPasswordSelection.otpForm.addEventListener(
    'submit',
    forgotPasswordSubscribe.resetPassword
  );

  forgotPasswordSelection.resendButton.addEventListener(
    'click',
    forgotPasswordSubscribe.resendOtp
  );
});

const toggleNewPassword = document.getElementById('toggleNewPassword');

toggleNewPassword.addEventListener('click', () => {
  const newPasswordInput = document.getElementById('newPassword');

  showPassToggle(newPasswordInput);
});
