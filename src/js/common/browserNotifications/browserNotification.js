import browserNotificationsSelection from './browserNotificationsSelector';
import {
  loadNotifications,
  markAllAsSeen,
} from './browserNotificationSubscribe';

// await loadNotifications();
let notificationOffset = 0;

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotifications(notificationOffset);
  notificationOffset += 10;
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
