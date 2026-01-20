import '../../scss/sidebar.scss';

//@ts-expect-error bootstrap import
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import { Templates } from './Templates';
import { getCurrentUser } from './api/helperApi.js';

const toast = new Templates();
const toastSection = document.getElementById('toastSection');

document.addEventListener('DOMContentLoaded', showSidebar);

async function showSidebar() {
  try {
    await loadSidebar();

    initializeSidebar();

    // Load user + hide restricted menu items
    const user = await getCurrentUser();
    const manageWarehouse = document.getElementById('manageWarehouse');

    if (manageWarehouse && user.role !== 'admin') {
      manageWarehouse.classList.add('d-none');
    }
    // Hide Archived Products link for non-admin users
    const archivedLi = document.getElementById('archivedProducts');
    if (archivedLi && user.role !== 'admin') {
      archivedLi.classList.add('d-none');
    }
  } catch (err) {
    toastSection.innerHTML = toast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

async function loadSidebar() {
  try {
    const response = await fetch('sidebar.html');
    if (!response.ok) {
      throw new Error('Sidebar not found');
    }

    const html = await response.text();
    const container = document.getElementById('sidebar-container');
    if (container) {
      container.innerHTML = html;
    }
  } catch (err) {
    console.error('Error loading sidebar:', err);
  }
}

function initializeSidebar() {
  const toggleButton = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');

  if (!sidebar || !toggleButton) {
    return;
  }

  // Toggle sidebar
  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
    // Hide toggle when sidebar is open
    toggleButton.style.display = sidebar.classList.contains('active')
      ? 'none'
      : 'flex';
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    const clickedOutside =
      !sidebar.contains(e.target) && !toggleButton.contains(e.target);

    if (sidebar.classList.contains('active') && clickedOutside) {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
      // Show toggle when sidebar is closed
      toggleButton.style.display = 'flex';
    }
  });

  // Highlight active link
  const currentPath = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('.sidebar-menu a');

  links.forEach((link) => {
    const linkPath = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPath === currentPath);
  });

  const logoutButton = document.querySelector('.logout-button');
  logoutButton?.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '../../pages/login.html';
  });
}
