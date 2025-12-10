import browserNotificationsSelection from "./browserNotificationsSelector";
import { loadNotifications, markAllAsSeen } from "./browserNotificationSubscribe";

// await loadNotifications();

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotifications(0);
});

browserNotificationsSelection.notificationBell.addEventListener('click', async ()=>{
  await markAllAsSeen();
});