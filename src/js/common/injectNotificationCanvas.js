const container = document.getElementById('notifications-container');

fetch('../../pages/notification.html')
  .then((res) => res.text())
  .then((html) => {
    container.innerHTML = html;

    import('./notifications/notification.js');
    import ('./../../scss/common/_notification.scss');
  })
  .catch((err) => {
    console.error('Failed to load notifications offcanvas:', err);
  });
