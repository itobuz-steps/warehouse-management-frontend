import axios from 'axios';
import Templates from '../../common/Templates';

document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('emailForm');
  const otpForm = document.getElementById('otpForm');
  const emailInput = document.getElementById('email');
  const otpInput = document.getElementById('otp');
  const newPasswordInput = document.getElementById('newPassword');
  const toastSection = document.getElementById('toastSection');
  const toastMessage = new Templates();

  const API_BASE = 'http://localhost:3000/user/auth';

  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    try {
      const res = await axios.post(`${API_BASE}/send-otp`, { email });
      if (res.data.success) {
        emailForm.style.display = 'none';
        otpForm.style.display = 'block';
        toastSection.innerHTML = toastMessage.successToast(
          'OTP sent! Check your email.'
        );
      }
    } catch (err) {
      toastSection.innerHTML = toastMessage.errorToast(err.message);
    } finally {
      setTimeout(() => {
        toastSection.innerHTML = '';
      }, 3000);
    }
  });

  otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const otp = otpInput.value.trim();
    const password = newPasswordInput.value.trim();

    try {
      const res = await axios.post(`${API_BASE}/forgot-password/${email}`, {
        email,
        otp,
        password,
      });

      if (res.data.success) {
        toastSection.innerHTML = toastMessage.successToast(
          'Password Reset Successful. Redirecting to Login Page..'
        );
        setTimeout(() => (window.location.href = '/pages/login.html'), 1500);
      }
    } catch (err) {
      toastSection.innerHTML = toastMessage.errorToast(err.message);
    } finally {
      setTimeout(() => {
        toastSection.innerHTML = '';
      }, 3000);
    }
  });
});
