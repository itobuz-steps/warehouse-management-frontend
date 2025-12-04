import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Templates from '../Templates.js';
import browserNotificationsSelection from './browserNotificationsSelector.js';
import { notificationItem } from '../template/notificationTemplate.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

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

//adding single notification in the list.
function addNotfication(notification) {

}

// rendering notifications & handling bell unseen notification.
function renderNotifications(notifications) {

}

export { loadNotifications, renderNotifications, markAllAsSeen };
