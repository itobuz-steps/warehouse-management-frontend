import '../../scss/sidebar.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import Templates from './Templates';
import { getCurrentUser } from './api/HelperApi';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

document.addEventListener('DOMContentLoaded', showSidebar);

async function showSidebar() {
  try {
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

    const user = await getCurrentUser();

    const manageWarehouse = document.getElementById('manageWarehouse');

    if (user.role !== 'admin') {
      manageWarehouse.classList.add('d-none');
    }
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

function initializeSidebar() {
  const toggleButton = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');

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
  const logoutButton = document.querySelector('.logout-button');

  links.forEach((link) => {
    const linkPath = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPath === currentPath);
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    window.location.href = '../../pages/login.html';
  });
}
