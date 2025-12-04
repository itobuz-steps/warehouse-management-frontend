import { loadNotifications } from "./browserNotificationSubscribe";

// await loadNotifications();

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotifications(0);
});