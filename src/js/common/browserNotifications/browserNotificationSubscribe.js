import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../Templates.js';
import browserNotificationsSelection from './browserNotificationsSelector.js';
import createNotificationTemplate from '../template/browserNotificationTemplate.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const outputArray = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) outputArray[i] = raw.charCodeAt(i);
  return outputArray;
}

async function registerAndSubscribe() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const swRegistration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    let subscription = await swRegistration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.VAPID_PUBLIC_KEY),
      });
    }

    await api.post(
      `${config.BROWSER_NOTIFICATION_BASE_URL}/subscribe`,
      subscription.toJSON(),
      { headers: { 'Content-Type': 'application/json' } }
    );

    return subscription;
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
}

// Load Notifications with Loader

export async function loadNotifications(offset) {
  // show loader while loading
  browserNotificationsSelection.loaderContainer.style.display = 'block';

  try {
    const res = await api.get(
      `${config.BROWSER_NOTIFICATION_BASE_URL}/${offset}`
    );

    if (!res.data.success) throw new Error('Error loading notifications');

    const notifications = res.data.data || [];
    const unseenCount = res.data.unseenCount;

    // badge count
    if (unseenCount > 0) {
      browserNotificationsSelection.notificationCount.textContent = unseenCount;
      browserNotificationsSelection.notificationCount.style.display =
        'inline-block';
    } else {
      browserNotificationsSelection.notificationCount.textContent = 0;
      browserNotificationsSelection.notificationCount.style.display = 'none';
    }

    renderNotifications(notifications, offset);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  } finally {
    // hide loader after loading completes
    browserNotificationsSelection.loaderContainer.style.display = 'none';
  }
}

// Render notifications

export async function renderNotifications(notifications, offset) {
  try {
    if (offset === 0)
      browserNotificationsSelection.notificationList.innerHTML = '';

    notifications.forEach((notification) => {
      browserNotificationsSelection.notificationList.innerHTML +=
        createNotificationTemplate(notification);
    });

    // ship buttons
    const shipButtons = document.querySelectorAll('.ship-btn');

    shipButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const transactionId = e.target.id;
        if (!transactionId) return;

        await api.patch(
          `${config.BROWSER_NOTIFICATION_BASE_URL}/change-shipment-status/${transactionId}`
        );

        e.target.innerText = 'Shipped';
        btn.disabled = true;
      });
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
}


//  Mark all seen

export async function markAllAsSeen() {
  try {
    if (browserNotificationsSelection.notificationCount.innerHTML == 0) return;

    await api.put(`${config.BROWSER_NOTIFICATION_BASE_URL}/mark-all-seen`);
    browserNotificationsSelection.notificationCount.style.display = 'none';
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
}


//  Infinite Scroll Observer 


let isLoading = false;

const callback = async (entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting && !isLoading) {
      isLoading = true;

      browserNotificationsSelection.loaderContainer.style.display = 'block';

      const offset =
        browserNotificationsSelection.notificationList.children.length;

      await loadNotifications(offset);

      browserNotificationsSelection.loaderContainer.style.display = 'none';
      isLoading = false;
    }
  }
};

// Offcanvas body is scrollable, so we use it as the root
const observer = new IntersectionObserver(callback, {
  root: document.querySelector('.offcanvas-body'),
  rootMargin: '0px',
  threshold: 0.1,
});

const sentinel = document.querySelector('#sentinel');
if (sentinel) observer.observe(sentinel);

export { registerAndSubscribe };
