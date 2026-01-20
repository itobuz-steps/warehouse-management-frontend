const forgotPasswordSelection = {
  emailForm: document.getElementById('emailForm') as HTMLFormElement,
  otpForm: document.getElementById('otpForm') as HTMLFormElement,
  emailInput: document.getElementById('email') as HTMLInputElement,
  otpInput: document.getElementById('otp') as HTMLInputElement,
  newPasswordInput: document.getElementById('newPassword') as HTMLInputElement,
  toastSection: document.getElementById('toastSection') as HTMLDivElement,
  resendButton: document.querySelector('.resend-btn') as HTMLButtonElement,

  otpTimerSection: document.querySelector('.timer'),
  otpCounter: document.querySelector('.counter') as HTMLSpanElement,
};

export default forgotPasswordSelection;
