// const notificationItem = (notification) => {
//   const { title, message, createdAt, seen, type } = notification;

//   const txId =
//     notification?.transactionId?._id || // populated version
//     notification?.transactionId || // raw string version
//     '';

//   const unseenClass = !seen ? 'bg-light' : '';
//   const formattedDate = new Date(createdAt).toLocaleString();

//   const shipButton =
//     type === 'PENDING_SHIPMENT' && txId
//       ? `
//       <div class="mt-2">
//         <button 
//           class="btn btn-sm btn-primary ship-btn" 
//           style="background-color: #864a5b; border-color: #2d292aff;"
//           data-transaction="${txId}">
//           Ship
//         </button>
//       </div>`
//       : '';

//   return `
//     <div class="notif-item border-bottom py-2 ${unseenClass}">
//       <strong>${title || 'Notification'}</strong>
//       <p class="mb-0 small">${message}</p>
//       <small class="text-muted">${formattedDate}</small>
//       ${shipButton}
//     </div>
//   `;
// };

// const emptyNotifications = () => {
//   return '<p class="text-muted text-center py-3">No notifications yet.</p>';
// };

// export { notificationItem, emptyNotifications };
