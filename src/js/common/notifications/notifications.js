import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';
import api from '../../api/interceptor.js';
import config from '../../config/config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const notifBell =
    document.querySelector('.notif-bell') ||
    document.getElementById('notif-bell');
  const notifList = document.getElementById('notif-list');
  const notifCount = document.getElementById('notif-count');
  const offcanvasEl =
    document.getElementById('offcanvasNotifications') ||
    document.getElementById('notificationOffcanvas');

  if (!notifBell || !notifList || !offcanvasEl) return;

  let notifications = [];
  let socket;

  async function getUserId() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;

      const res = await api.get(`${config.PROFILE_BASE_URL}/me`);
      if (!res.data.success) return null;
      return res.data.data.user._id;
    } catch (err) {
      console.error('Error fetching user ID:', err);
      return null;
    }
  }

  async function initSocket() {
    const userId = await getUserId();
    if (!userId) return;

    socket = io(config.BASE_URL, { query: { userId } });

    socket.on('connect', () => console.log('Socket connected!'));
    socket.on('notification', (notif) => {
      notifications.unshift(notif);
      renderNotifications();
    });
    socket.on('connect_error', (err) => console.error('Socket error:', err));
  }

  async function loadNotifications() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found');
        return;
      }

      const res = await api.get(
        `${config.NOTIFICATION_BASE_URL}/my-notifications`
      );
      if (!res.data.success) {
        console.error('Failed to fetch notifications');
        return;
      }

      notifications = res.data.data;
      renderNotifications();
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }

  function renderNotifications() {
    const unseenCount = notifications.filter((n) => !n.seen).length;

    if (!notifications.length) {
      notifList.innerHTML =
        '<p class="text-muted text-center py-3">No notifications yet.</p>';
      if (notifCount) {
        notifCount.textContent = '0';
        notifCount.style.display = 'none';
      }
      return;
    }

    notifList.innerHTML = notifications
      .map(
        (n) => `
      <div class="notif-item border-bottom py-2 ${!n.seen ? 'bg-light' : ''}">
        <strong>${n.title || 'Notification'}</strong>
        <p class="mb-0 small">${n.message}</p>
        <small class="text-muted">${new Date(n.createdAt).toLocaleString()}</small>
      </div>
    `
      )
      .join('');

    if (notifCount) {
      notifCount.textContent = unseenCount;
      notifCount.style.display = unseenCount > 0 ? 'inline-block' : 'none';
    }
  }

  // Mark all as seen when offcanvas is opened
  offcanvasEl.addEventListener('shown.bs.offcanvas', async () => {
    if (notifications.some((n) => !n.seen)) {
      try {
        await api.patch(`${config.NOTIFICATION_BASE_URL}/mark-all-seen`);
        notifications.forEach((n) => (n.seen = true));
        renderNotifications();
      } catch (err) {
        console.error('Error marking notifications as seen:', err);
      }
    }
  });

  await loadNotifications();
  await initSocket();
});
