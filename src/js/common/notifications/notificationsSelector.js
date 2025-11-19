const notificationsSelection = () => ({
  notifBell:
    document.querySelector('.notif-bell') ||
    document.getElementById('notif-bell'),
  notifList: document.getElementById('notif-list'),
  notifCount: document.getElementById('notif-count'),
  offcanvasEl:
    document.getElementById('offcanvasNotifications') ||
    document.getElementById('notificationOffcanvas'),
});

export default notificationsSelection;
