import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('emailForm');
  const otpForm = document.getElementById('otpForm');
  const emailInput = document.getElementById('email');
  const otpInput = document.getElementById('otp');
  const newPasswordInput = document.getElementById('newPassword');
  const message = document.getElementById('message');

  const API_BASE = 'http://localhost:3000/user/auth';

  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    message.textContent = '';
    message.style.color = '';
    ``;

    try {
      const res = await axios.post(`${API_BASE}/send-otp`, { email });
      if (res.data.success) {
        message.style.color = 'green';
        message.textContent = 'OTP sent! Check your email.';
        emailForm.style.display = 'none';
        otpForm.style.display = 'block';
      }
    } catch (err) {
      message.style.color = 'red';
      message.textContent =
        err.response?.data?.message || 'Failed to send OTP.';
    }
  });

  otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const otp = otpInput.value.trim();
    const password = newPasswordInput.value.trim();
    message.textContent = '';
    message.style.color = '';

    try {
      const res = await axios.post(`${API_BASE}/forgot-password/${email}`, {
        email,
        otp,
        password,
      });

      if (res.data.success) {
        message.style.color = 'green';
        message.textContent =
          'Password reset successful! Redirecting to login...';
        setTimeout(() => (window.location.href = '/pages/login.html'), 1500);
      }
    } catch (err) {
      message.style.color = 'red';
      message.textContent =
        err.response?.data?.message || 'Error resetting password.';
    }
  });
});
