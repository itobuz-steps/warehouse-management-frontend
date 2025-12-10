const createNotificationTemplate = (notification) => {
  const { title, message, transactionId, createdAt, seen, type, isShipped, shippedBy} =
    notification;
    console.log(shippedBy);

  const unseenClass = !seen ? 'bg-light' : '';
  const formattedDate = new Date(createdAt).toLocaleString();

  let shipButton = '';
  let shipmentDetail = '';

  if (type === 'PENDING_SHIPMENT') {
    if(!isShipped){
      shipButton = `
          <div class="mt-2">
            <button 
              class="btn btn-sm btn-primary ship-btn" 
              style="background-color: #864a5b; border-color: #2d292aff;" id="${transactionId}">
              Ship
            </button>
          </div>`;
    } else{
      shipmentDetail = `Shipped By: ${shippedBy}`;
    }
  }

  return `
    <div class="notif-item border-bottom py-2 ${unseenClass}">
      <strong>${title || 'Notification'}</strong>
      <p class="mb-0 small">${message}</p>
      <small class="text-muted">${formattedDate}</small>
      ${shipButton}
      <p>${shipmentDetail}</p>
    </div>
  `;
};

export default createNotificationTemplate;
