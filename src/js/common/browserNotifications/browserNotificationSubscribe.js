import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../Templates.js';
import browserNotificationsSelection from './browserNotificationsSelector.js';
import createNotificationTemplate from '../template/browserNotificationTemplate.js';

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

//registering new/old user.
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
      `${config.BROWSER_NOTIFICATION_BASE_URL}/subscribe`,
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

export async function loadNotifications(offset) {

  browserNotificationsSelection.loaderContainer.style.display = 'block';

  try {
    console.log('Load notifications is called');
    const res = await api.get(
      `${config.BROWSER_NOTIFICATION_BASE_URL}/${offset}`
    );

    if (!res.data.success) {
      throw new Error('Error in loading notification');
    }

    //extract top 10 notification.
    const notifications = res.data.data || [];
    const unseenCount = res.data.unseenCount;

    //updating unseen notification count.
    if (unseenCount > 0) {
      browserNotificationsSelection.notificationCount.textContent = unseenCount;
      browserNotificationsSelection.notificationCount.style.display =
        'inline-block';
    } else {
      //fix unseen count to zero and remove top number.
      browserNotificationsSelection.notificationCount.textContent = 0;
      browserNotificationsSelection.notificationCount.style.display = 'none';
    }

    renderNotifications(notifications, offset);

  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  } finally {
    browserNotificationsSelection.loaderContainer.style.display = 'none';
  }
}

// rendering notifications & handling bell unseen notification.
async function renderNotifications(notifications, offset) {
  try {
    if (offset === 0) {
      browserNotificationsSelection.notificationList.innerHTML = '';
    }

    notifications.forEach((notification) => {
      browserNotificationsSelection.notificationList.innerHTML +=
        createNotificationTemplate(notification);
    });

    const shipButtons = document.querySelectorAll('.ship-btn');

    shipButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        console.log('shipment button clicked');
        const transactionId = event.target.id;

        if (!transactionId) {
          return;
        }

        console.log(transactionId);

        //calling API to change the shipment status.
        await api.patch(
          `${config.BROWSER_NOTIFICATION_BASE_URL}/change-shipment-status/${transactionId}`
        );

        event.target.innerText = 'Shipped';
        button.disabled = true;
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
    //if everything is already seen, then mark as seen will not be called.
    if (browserNotificationsSelection.notificationCount.innerHTML == 0) {
      return;
    }

    await api.put(`${config.BROWSER_NOTIFICATION_BASE_URL}/mark-all-seen`);

    browserNotificationsSelection.notificationCount.style.display = 'none';

  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

// Callback function for the IntersectionObserver
const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const offset =
        browserNotificationsSelection.notificationList.children.length;
      loadNotifications(offset);
    }
  });
};

// Options for the IntersectionObserver
const options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0,
};

// Create the observer
const observer = new IntersectionObserver(callback, options);

// Start observing the sentinel
const sentinel = document.querySelector('#sentinel');
if(sentinel){
  observer.observe(sentinel);
}

export {
  registerAndSubscribe,
  renderNotifications,
  markAllAsSeen,
};
