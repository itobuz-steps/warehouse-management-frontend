const createNotificationTemplate = (notification) => {
  console.log(notification);
  const { title, message, transactionId, createdAt, seen, type } = notification;

  const unseenClass = !seen ? 'bg-light' : '';
  const formattedDate = new Date(createdAt).toLocaleString();

  let shipButton = '';

  if (type === 'PENDING_SHIPMENT') {
    shipButton = `
      <div class="mt-2">
        <button 
          class="btn btn-sm btn-primary ship-btn" 
          style="background-color: #864a5b; border-color: #2d292aff;" data-transaction="${transactionId}">
          Ship
        </button>
      </div>`;
  }

  return `
    <div class="notif-item border-bottom py-2 ${unseenClass}">
      <strong>${title || 'Notification'}</strong>
      <p class="mb-0 small">${message}</p>
      <small class="text-muted">${formattedDate}</small>
      ${shipButton}
    </div>
  `;
};

export { createNotificationTemplate };
