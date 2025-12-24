import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../Templates.js';
import notificationSelection from './notificationSelector.js';
import createNotificationTemplate from '../template/notificationTemplate.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const outputArray = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; ++i) {
    outputArray[i] = raw.charCodeAt(i);
  }

  return outputArray;
}

async function registerAndSubscribe() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return;
    }

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
      `${config.NOTIFICATION_BASE_URL}/subscribe`,
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
  notificationSelection.loaderContainer.style.display = 'block';

  try {
    const res = await api.get(
      `${config.NOTIFICATION_BASE_URL}/${offset}`
    );
    console.log(res);
    
    if (!res.data.success) {
      throw new Error('Error loading notifications');
    }

    const notifications = res.data.data || [];

    console.log(notifications);

    const unseenCount = res.data.unseenCount;

    // badge count
    if (unseenCount > 0) {
      notificationSelection.notificationCount.textContent = unseenCount;
      notificationSelection.notificationCount.style.display = 'inline-block';
    } else {
      notificationSelection.notificationCount.textContent = 0;
      notificationSelection.notificationCount.style.display = 'none';
    }

    renderNotifications(notifications, offset);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  } finally {
    // hide loader after loading completes
    notificationSelection.loaderContainer.style.display = 'none';
  }
}

// Render notifications
export async function renderNotifications(notifications, offset) {
  try {
    if (offset === 0) {
      notificationSelection.notificationList.innerHTML = '';
    }

    notifications.forEach((notification) => {
      notificationSelection.notificationList.innerHTML +=
        createNotificationTemplate(notification.notification);
    });

    // ship buttons
    const shipButtons = document.querySelectorAll('.ship-btn');

    shipButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const transactionId = e.target.dataset.id;

        if (!transactionId) {
          return;
        }

        try {
          await api.patch(
            `${config.NOTIFICATION_BASE_URL}/change-shipment-status/${transactionId}`
          );

          e.target.innerText = 'Shipped';
          e.target.disabled = true;

          const cancelBtn = btn.parentElement.querySelector('.cancel-btn');

          if (cancelBtn) {
            cancelBtn.disabled = true;
          }
        } catch (err) {
          toastSection.innerHTML = displayToast.errorToast(err.message);
          setTimeout(() => (toastSection.innerHTML = ''), 3000);
        }
      });
    });

    // cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-btn');

    cancelButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const transactionId = e.target.dataset.id;

        if (!transactionId) {
          return;
        }

        try {
          await api.patch(
            `${config.NOTIFICATION_BASE_URL}/cancel-shipment/${transactionId}`
          );

          e.target.innerText = 'Cancelled';
          e.target.disabled = true;

          const shipBtn = btn.parentElement.querySelector('.ship-btn');

          if (shipBtn) {
            shipBtn.disabled = true;
          }
        } catch (err) {
          toastSection.innerHTML = displayToast.errorToast(err.message);
          setTimeout(() => (toastSection.innerHTML = ''), 3000);
        }
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
    if (notificationSelection.notificationCount.innerHTML == 0) {
      return;
    }

    await api.put(`${config.NOTIFICATION_BASE_URL}/mark-all-seen`);

    notificationSelection.notificationCount.style.display = 'none';
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

      notificationSelection.loaderContainer.style.display = 'block';

      const offset = notificationSelection.notificationList.children.length;

      await loadNotifications(offset);

      notificationSelection.loaderContainer.style.display = 'none';
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

if (sentinel) {
  observer.observe(sentinel);
}

export { registerAndSubscribe };
