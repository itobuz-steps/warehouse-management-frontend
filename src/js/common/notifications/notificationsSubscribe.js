import { io } from 'socket.io-client';
import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import notificationsSelection from './notificationsSelector.js';
import {
  notificationItem,
  emptyNotifications,
} from '../template/notificationTemplate.js';

let notifications = [];
let socket;
let selectors;

// Get the current user's ID from profile API
async function getUserId() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }

    const res = await api.get(`${config.PROFILE_BASE_URL}/me`);
    if (!res.data.success) {
      return null;
    }
    return res.data.data.user._id;
  } catch (err) {
    console.error('Error fetching user ID:', err);
    return;
  }
}

async function initSocket() {
  const userId = await getUserId();
  if (!userId) return;

  socket = io(config.BASE_URL, {
    query: { userId },
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionAttempts: 3,
  });

  socket.on('connect', () => console.log('Socket connected successfully!'));
  socket.on('notification', (notif) => {
    notifications.unshift(notif);
    renderNotifications();
  });
  socket.on('connect_error', (err) => {
    console.warn('Socket connection failed.', err.message);
  });
}

// Load notifications from the API
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

// Render notifications in the UI
function renderNotifications() {
  if (!selectors) return;
  const { notifList, notifCount } = selectors;
  const unseenCount = notifications.filter((n) => !n.seen).length;

  if (!notifications.length) {
    notifList.innerHTML = emptyNotifications();
    if (notifCount) {
      notifCount.textContent = '0';
      notifCount.style.display = 'none';
    }
    return;
  }

  notifList.innerHTML = notifications.map((n) => notificationItem(n)).join('');

  // Attach handlers to any Ship buttons rendered for pending shipments
  try {
    const shipButtons = notifList.querySelectorAll('.ship-btn');
    shipButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const transactionId = btn.dataset.transaction;
        if (!transactionId) return;

        try {
          // Call backend to change shipment status to shipped
          await api.patch(
            `${config.NOTIFICATION_BASE_URL}/change-shipment-status/${transactionId}`
          );

          // Remove any notifications referencing this transaction and re-render
          notifications = notifications.filter((n) => {
            const tId =
              n.transactionId && (n.transactionId._id || n.transactionId);
            return !(tId && `${tId}` === `${transactionId}`);
          });
          renderNotifications();
        } catch (err) {
          console.error('Error changing shipment status:', err);
        }
      });
    });
  } catch (attachErr) {
    console.error('Error attaching ship button handlers:', attachErr);
  }

  if (notifCount) {
    notifCount.textContent = unseenCount;
    if (unseenCount > 0) {
      notifCount.style.display = 'inline-block';
    } else {
      notifCount.style.display = 'none';
    }
  }
}

// Mark all notifications as seen
async function markAllAsSeen() {
  if (notifications.some((n) => !n.seen)) {
    try {
      await api.patch(`${config.NOTIFICATION_BASE_URL}/mark-all-seen`);
      notifications.forEach((n) => (n.seen = true));
      renderNotifications();
    } catch (err) {
      console.error('Error marking notifications as seen:', err);
    }
  }
}

export async function initNotifications() {
  selectors = notificationsSelection();
  const { offcanvasEl } = selectors;

  // Mark all as seen when offcanvas is opened
  offcanvasEl.addEventListener('shown.bs.offcanvas', markAllAsSeen);

  await loadNotifications();
  await initSocket();
}

export { loadNotifications, renderNotifications, markAllAsSeen };
