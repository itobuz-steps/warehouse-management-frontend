import notificationSelection from './notificationSelector';
import { loadNotifications, markAllAsSeen } from './notificationSubscribe';

// await loadNotifications();
let notificationOffset = 0;

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotifications(notificationOffset);
  notificationOffset += 10;
});

notificationSelection.notificationBell.addEventListener('click', async () => {
  await markAllAsSeen();
});

notificationSelection.canvasClose.addEventListener('click', () => {
  const notificationItems = document.querySelectorAll('.notif-item');

  notificationItems.forEach((item) => {
    item.classList.remove('bg-light');
  });
});
