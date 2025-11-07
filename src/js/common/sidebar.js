import '../../scss/sidebar.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  fetch('sidebar.html')
    .then((response) => {
      if (!response.ok) throw new Error('Sidebar not found');
      return response.text();
    })
    .then((html) => {
      document.getElementById('sidebar-container').innerHTML = html;
      initializeSidebar();
    })
    .catch((err) => {
      console.error('Error loading sidebar:', err);

      initializeSidebar();
    });
});

function initializeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.getElementById('sidebarToggle');

  if (!sidebar || !toggleButton) return;

  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('active') &&
      !sidebar.contains(e.target) &&
      !toggleButton.contains(e.target)
    ) {
      sidebar.classList.remove('active');
    }
  });

  const currentPath = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('.sidebar-menu a');

  links.forEach((link) => {
    const linkPath = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPath === currentPath);
  });

  const logoutButton = document.querySelector('.logout-button');

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '../../pages/login.html';
  });
}
