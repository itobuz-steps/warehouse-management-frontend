const createNotificationTemplate = (notification) => {
  let unseenClass;

  if (!notification.seen) {
    unseenClass = 'bg-light';
  } else {
    unseenClass = '';
  }

  const formattedDate = new Date(notification.createdAt).toLocaleString();
  let shipButton = '';
  let shipmentDetails = '';

  if (notification.type === 'PENDING_SHIPMENT') {
    if (!notification.isShipped) {
      shipButton = `
          <div class="mt-2">
            <button 
              class="btn btn-sm btn-primary ship-btn" 
              style="background-color: #864a5b; border-color: #2d292aff;" id="${notification.transactionId}">
              Ship
            </button>
          </div>`;
    } else {
      shipmentDetails = `Shipped By: ${notification.shippedBy}`;
    }
  }

  return `
    <div class="notif-item border-bottom py-2 ${unseenClass}">
      <strong>${notification.title || 'Notification'}</strong>
      <p class="mb-0 small">${notification.message}</p>
      <p class="mb-0 small">Transaction Id:${notification.transactionId}</p>
      <small class="text-muted">${formattedDate}</small>
      ${shipButton}
      <p class="mb-0 small">${shipmentDetails}</p>
    </div>
  `;
};

export default createNotificationTemplate;
