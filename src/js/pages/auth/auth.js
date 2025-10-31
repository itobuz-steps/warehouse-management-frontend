document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Login functionality would be implemented here');
});

const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach((btn) => {
  btn.addEventListener('click', function () {
    tabButtons.forEach((b) => b.classList.remove('active'));
    this.classList.add('active');

    if (this.textContent === 'Register') {
      document.querySelector('.right-panel h2').textContent =
        "Let's create your account.";
      document.querySelector('.login-btn').textContent = 'Register';
      document.querySelector('.signup-link').innerHTML =
        'Already have an account? <a href="#">Login</a>';
    } else {
      document.querySelector('.right-panel h2').textContent =
        "Let's login to your account.";
      document.querySelector('.login-btn').textContent = 'Login';
    }
  });
});
