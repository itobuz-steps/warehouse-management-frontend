import axios from 'axios';
import Templates from '../../common/Templates';
import forgotPasswordSelection from './forgotPasswordSelector';
import config from '../../config/config';

const toastMessage = new Templates();

class ForgotPasswordSubscribe {
  sendOtp = async (event) => {
    event.preventDefault();
    const email = forgotPasswordSelection.emailInput.value.trim();
    try {
      const res = await axios.post(`${config.AUTH_BASE_URL}/send-otp`, {
        email,
      });

      if (res.data.success) {
        forgotPasswordSelection.emailForm.style.display = 'none';
        forgotPasswordSelection.otpForm.style.display = 'block';

        forgotPasswordSelection.toastSection.innerHTML =
          toastMessage.successToast('OTP sent! Check your Email');
      }
    } catch (err) {
      console.log(err);
      forgotPasswordSelection.toastSection.innerHTML = toastMessage.errorToast(
        err.response.data.message
      );
    } finally {
      setTimeout(() => {
        forgotPasswordSelection.toastSection.innerHTML = '';
      }, 3000);
    }
  };

  resetPassword = async (event) => {
    event.preventDefault();
    const email = forgotPasswordSelection.emailInput.value.trim();
    const otp = forgotPasswordSelection.otpInput.value.trim();
    const password = forgotPasswordSelection.newPasswordInput.value.trim();

    if (!otp || !password) {
      forgotPasswordSelection.toastSection.innerHTML = toastMessage.errorToast(
        'Please fill all the fields'
      );
    }

    try {
      const res = await axios.post(
        `${config.AUTH_BASE_URL}/forgot-password/${email}`,
        {
          email,
          otp,
          password,
        }
      );

      if (res.data.success) {
        forgotPasswordSelection.toastSection.innerHTML =
          toastMessage.successToast(
            'Password Reset Successful. Redirecting to Login Page..'
          );
        setTimeout(() => {
          window.location.href = '/src/pages/login.html';
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      forgotPasswordSelection.toastSection.innerHTML = toastMessage.errorToast(
        err.response.data.message
      );
    } finally {
      setTimeout(() => {
        forgotPasswordSelection.toastSection.innerHTML = '';
      }, 3000);
    }
  };

  resendOtp = async () => {
    const email = forgotPasswordSelection.emailInput.value.trim();
    try {
      const res = await axios.post(`${config.AUTH_BASE_URL}/send-otp`, {
        email,
      });

      console.log(res);

      if (res.data.success) {
        forgotPasswordSelection.emailForm.style.display = 'none';
        forgotPasswordSelection.otpForm.style.display = 'block';

        forgotPasswordSelection.toastSection.innerHTML =
          toastMessage.successToast('OTP sent again! Check your Email');
      }
    } catch (err) {
      console.log(err);
      forgotPasswordSelection.toastSection.innerHTML = toastMessage.errorToast(
        err.response.data.message
      );
    } finally {
      setTimeout(() => {
        forgotPasswordSelection.toastSection.innerHTML = '';
      }, 3000);
    }
  };
}

export default ForgotPasswordSubscribe;
