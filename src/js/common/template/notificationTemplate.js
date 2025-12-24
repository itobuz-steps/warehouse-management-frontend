const createNotificationTemplate = (notification) => {
  const unseenClass = !notification.seen ? 'bg-light' : '';
  const formattedDate = new Date(notification.createdAt).toLocaleString();

  let buttons = '';
  let shipmentDetails = '';

  if (notification.type === 'PENDING_SHIPMENT') {
    if (!notification.isShipped && !notification.isCancelled) {
      buttons = `
        <div class="mt-2 d-flex gap-2">

          <button 
            class="btn btn-sm btn-primary ship-btn"
            style="background-color: #864a5b; border-color: #2d292aff;"
            data-id="${notification.transactionId}">
            Ship
          </button>

          <button 
            class="btn btn-sm btn-danger cancel-btn"
            data-id="${notification.transactionId}">
            Cancel
          </button>
        </div>
      `;
    }

    if (notification.isShipped) {
      shipmentDetails = `Shipped By: ${notification.reportedBy || notification.shippedBy}`;
    }

    if (notification.isCancelled) {
      shipmentDetails = `Cancelled By: ${notification.reportedBy}`;
    }
  }

  return `
  <div class="notif-item border-bottom py-2 ${unseenClass}">
    <div class="d-flex align-items-start gap-3">
      
      <img 
        src="${notification.user.profileImage || '../../assets/images/profileImage.png'}"
        alt="Profile"
        class="rounded-circle"
        width="45"
        height="45"
        style="object-fit: cover;"
      />

      <div class="flex-grow-1">
        <strong>${notification.title || 'Notification'}</strong>
        <p class="mb-0 small">${notification.message}</p>
        <p class="mb-0 small">Transaction Id: ${notification.transactionId}</p>
        <small class="text-muted">${formattedDate}</small>
        ${buttons}
        <p class="mb-0 small">${shipmentDetails}</p>
      </div>

    </div>
  </div>
`;

  // <div class="notif-item border-bottom py-2 ${unseenClass}">
  //   <strong>${notification.title || 'Notification'}</strong>
  //   <p class="mb-0 small">${notification.message}</p>
  //   <p class="mb-0 small">Transaction Id: ${notification.transactionId}</p>
  //   <small class="text-muted">${formattedDate}</small>
  //   ${buttons}
  //   <p class="mb-0 small">${shipmentDetails}</p>
  // </div>
};

export default createNotificationTemplate;
