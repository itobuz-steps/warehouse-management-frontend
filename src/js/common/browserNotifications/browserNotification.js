import browserNotificationsSelection from './browserNotificationsSelector';
import {
  loadNotifications,
  markAllAsSeen,
} from './browserNotificationSubscribe';

// await loadNotifications();

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotifications(0);
});

browserNotificationsSelection.notificationBell.addEventListener(
  'click',
  async () => {
    await markAllAsSeen();
  }
);

browserNotificationsSelection.canvasClose.addEventListener('click', () => {
  const notificationItems = document.querySelectorAll('.notif-item');
  
  notificationItems.forEach((item) => {
    item.classList.remove('bg-light');
  });
});
