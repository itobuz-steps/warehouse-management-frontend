export function showPassToggle(passwordInput: HTMLInputElement) {
  const icon = document.getElementById('eyeBtn');

  if (!icon) {
    return;
  }

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}
