import config from '../../config/config.js';
import Templates from '../../common/Templates.js';
import api from '../../api/interceptor.js';
// import ''

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
    console.log('Register and subscribed called!');

    // Ask for notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    // Register service worker
    console.log('before registering services');

    const swRegistration = await navigator.serviceWorker.register(
      '/sw.js'
    );

    await navigator.serviceWorker.ready;
    console.log('Service worker registered:');

    // check if user is already subscribed
    let subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      console.log('Already subscribed:', subscription);
      return subscription;
    }

    console.log("prev subscription", subscription);
    console.log(config.VAPID_PUBLIC_KEY);
    
    // new subscription
    subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.VAPID_PUBLIC_KEY),
    });

    console.log('New subscription:', subscription);

    // 5. Send subscription to backend
    await api.post(
      `${config.BROWSER_NOTIFICATION_URL}/subscribe`,
      subscription,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('Subscription saved!');
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

export { registerAndSubscribe, sendNotification };
