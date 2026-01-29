import notificationSelection from './notificationSelector';
import { markAllAsSeen } from './notificationSubscribe';

// let notificationOffset = 0;

document.addEventListener('DOMContentLoaded', async () => {
  // await loadNotifications(notificationOffset);
  // notificationOffset += 10;
});

// Add null checks to prevent errors on pages without notification elements
if (notificationSelection.notificationBell) {
  notificationSelection.notificationBell.addEventListener('click', async () => {
    // console.log('mark all seen called');
    await markAllAsSeen();
  });
}

if (notificationSelection.canvasClose) {
  notificationSelection.canvasClose.addEventListener('click', () => {
    const notificationItems = document.querySelectorAll('.notif-item');

    notificationItems.forEach((item) => {
      item.classList.remove('bg-light');
    });
  });
}
