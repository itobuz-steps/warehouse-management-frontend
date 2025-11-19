const notificationItem = (notification) => {
  const { title, message, createdAt, seen } = notification;
  let unseenClass = '';
  if (!seen) {
    unseenClass = 'bg-light';
  }
  const formattedDate = new Date(createdAt).toLocaleString();

  return `
    <div class="notif-item border-bottom py-2 ${unseenClass}">
      <strong>${title || 'Notification'}</strong>
      <p class="mb-0 small">${message}</p>
      <small class="text-muted">${formattedDate}</small>
    </div>
  `;
};

const emptyNotifications = () => {
  return '<p class="text-muted text-center py-3">No notifications yet.</p>';
};

export { notificationItem, emptyNotifications };
