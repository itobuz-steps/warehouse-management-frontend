// Import our custom CSS
import '../../../scss/login.scss';

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    console.log({ email, password });
    alert('Login successful!');
  });

  // Send OTP
  const sendOtpForm = document.getElementById('sendOtpForm');
  sendOtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    console.log('OTP sent to:', email);
    alert(`OTP sent to ${email}`);
    const forgotModal = bootstrap.Modal.getInstance(
      document.getElementById('forgotModal')
    );
    forgotModal.hide();

    // Show verify modal
    const verifyModal = new bootstrap.Modal(
      document.getElementById('verifyModal')
    );
    verifyModal.show();
  });

  // Verify OTP and Reset Password
  const verifyOtpForm = document.getElementById('verifyOtpForm');
  verifyOtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const otp = document.getElementById('otpCode').value;
    const newPass = document.getElementById('newPassword').value;

    // Simulate verification
    if (otp === '123456') {
      // mock OTP for demo
      alert('Password reset successfully!');
      console.log(newPass);
      const verifyModal = bootstrap.Modal.getInstance(
        document.getElementById('verifyModal')
      );
      verifyModal.hide();
    } else {
      alert('Invalid OTP! Please try again.');
    }
  });
});
