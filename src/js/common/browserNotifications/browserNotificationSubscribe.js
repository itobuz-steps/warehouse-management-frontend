import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../Templates.js';
import browserNotificationsSelection from './browserNotificationsSelector.js';
import { createNotificationTemplate } from '../template/notificationTemplate.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

// base64 to UInt8Array for pushManager
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
    // Ask for notification permission
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      // console.log('Notification permission denied');
      return;
    }

    const swRegistration = await navigator.serviceWorker.register('/sw.js');

    await navigator.serviceWorker.ready;

    // check if user is already subscribed
    let subscription = await swRegistration.pushManager.getSubscription();

    // new subscription
    if (!subscription) {
      subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.VAPID_PUBLIC_KEY),
      });
    }

    // 5. Send subscription to backend
    await api.post(
      `${config.BROWSER_NOTIFICATION_URL}/subscribe`,
      subscription.toJSON(),
      { headers: { 'Content-Type': 'application/json' } }
    );

    return subscription;
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

async function sendNotification(title, body) {
  try {
    const payload = { title, body };

    // POST request to your backend to trigger the notification
    const response = await api.post(
      `${config.BROWSER_NOTIFICATION_URL}/trigger`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('Notification triggered:', response.data);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

// Load notifications from the API
async function loadNotifications() {
  try {
    const res = await api.get(`${config.BROWSER_NOTIFICATION_URL}/`);

    if (!res.data.success) {
      throw new Error('Error in loading notification');
    }

    //extract top 10 notification.
    const notifications = res.data.data || [];
    const unseenCount = res.data.data.unseenCount;

    //updating unseen notification count.
    if (unseenCount > 0) {
      browserNotificationsSelection.notificationCount.textContent = unseenCount;
      browserNotificationsSelection.notificationCount.style.display =
        'inline-block';
    } else {
      browserNotificationsSelection.notificationCount.style.display = 'none';
    }

    renderNotifications(notifications);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

//adding single notification in the list.
function addSingleNotification(notification) {
  // browserNotificationsSelection.notificationList.innerHTML +=
  //   createNotificationTemplate(notification);
}

// rendering notifications & handling bell unseen notification.
async function renderNotifications(notifications) {
  try {
    browserNotificationsSelection.notificationList.innerHTML = '';

    notifications.forEach((notification) => {
      browserNotificationsSelection.notificationList.innerHTML +=
        createNotificationTemplate(notification);
      const shipButton =
        browserNotificationsSelection.querySelector('.ship-btn');

      shipButton.addEventListener('click', async (event) => {
        const transactionId = event.target.id;
        if (!transactionId) {
          return;
        }

        //calling API to change the shipment status.
        await api.patch(
          `${config.NOTIFICATION_BASE_URL}/change-shipment-status/${transactionId}`
        );
      });
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

// Mark all notifications as seen
async function markAllAsSeen() {
  try {
    await api.patch(`${config.BROWSER_NOTIFICATION_BASE_URL}/mark-all-seen`);

    browserNotificationsSelection.notificationCount.style.display = 'none';
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

export {
  registerAndSubscribe,
  sendNotification,
  loadNotifications,
  addSingleNotification,
  renderNotifications,
  markAllAsSeen,
};
