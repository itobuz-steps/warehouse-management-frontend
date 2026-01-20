const notificationSelection = {
  notificationBell: document.querySelector<HTMLElement>('.notif-bell'),
  notificationList: document.querySelector('#notif-list'),
  notificationCount: document.querySelector('#notif-count'),
  offcanvasEl: document.querySelector('#notificationOffcanvas'),
  canvasClose: document.querySelector<HTMLButtonElement>(
    '.offcanvas-header .btn-close'
  ),
  loaderContainer: document.querySelector('#loaderContainer'),
  sentinel: document.querySelector('#sentinel'),
};

export default notificationSelection;
