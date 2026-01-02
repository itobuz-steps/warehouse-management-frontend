const createNotificationTemplate = (notification) => {
  const unseenClass = !notification.seen ? 'bg-light' : '';

  const formattedDate = new Date(notification.createdAt).toLocaleString();

  let buttons = '';
  let shipmentDetails = '';

  if (notification.type === 'pendingShipment') {
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
 <div class="${notification.type} notif-item border-bottom py-2 px-3 ${unseenClass} ">
    <div class="fw-semibold mb-2">
    ${notification.title || 'Notification'}
    </div>
    <p class="mb-1 small text-muted">
    ${notification.message}
    </p>

    <p class="mb-1 small text-muted">
    Transaction Id: ${notification.transactionId}
    </p>

    <p class="mb-1 small">
    ${shipmentDetails}
    </p>
    
    ${buttons}

    <div class="d-flex align-items-center mt-4 mb-2">
      <img 
        src="${notification.performedByImage || '../../assets/images/profileImage.png'}"
        alt="Profile"
        class="rounded-circle me-3"
        width="40"
        height="40"
        style="object-fit: cover;"
      />

      <div class="d-flex flex-column">
        <span>
          ${notification.performedByName}
        </span>
        <small>${formattedDate}</small>
      </div>
    </div>
  </div>
  `;
};

export default createNotificationTemplate;
