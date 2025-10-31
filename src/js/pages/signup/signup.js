// Import our custom CSS
import '../../../scss/signup.scss';

// Import all of Bootstrap’s JS
// import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  const emailField = document.getElementById('email');

  const backendEmail = 'user@example.com';
  emailField.value = backendEmail;

  const form = document.getElementById('signupForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log({ username, email: emailField.value, password });
    alert('Signup successful!');
  });
});
