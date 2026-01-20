import type { Notification } from '../../types/notification';

const createNotificationTemplate = (notification: Notification) => {
  const unseenClass = !notification.seen ? 'bg-light' : '';
  const cancelledClass = notification.isCancelled ? 'bg-danger-subtle' : '';

  const formattedDate = new Date(notification.createdAt).toLocaleString();

  let buttons = '';
  let shipmentDetails = '';

  if (notification.type === 'pendingShipment') {
    if (!notification.isShipped && !notification.isCancelled) {
      buttons = `
        <div class="mt-2 d-flex gap-2">

          <button 
            class="btn btn-sm ship-button"
            data-id="${notification.transactionId}">
            <i class="fa-solid fa-truck-fast"></i> Ship
          </button>

          <button 
            class="btn btn-sm cancel-button"
            style="background-color: #864a5b;"
            data-id="${notification.transactionId}">
             <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
      `;
    }

    if (notification.isShipped) {
      shipmentDetails = `Shipped By: ${notification.reportedByName}`;
    }

    if (notification.isCancelled) {
      shipmentDetails = `Cancelled By: ${notification.reportedByName}`;
    }
  }

  return `
 <div class="${notification.type} notif-item border-bottom py-2 px-3 ${cancelledClass} ${unseenClass}">
    <div class="fw-semibold mb-2">
    ${notification.title || 'Notification'}
    </div>
    <p class="mb-1 small text-muted">
    ${notification.message}
    </p>

    <p class="mb-1 small">
    ${shipmentDetails}
    </p>
    
    ${buttons}

    <div class="d-flex align-items-center mt-2 mb-2">
      <img 
        src="${notification.performedByImage || '../../../assets/images/icon.png'}"
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
