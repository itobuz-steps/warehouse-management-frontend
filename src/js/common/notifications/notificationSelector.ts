const notificationSelection = {
  notificationBell: document.querySelector<HTMLElement>('.notif-bell'),
  notificationList: document.querySelector('#notif-list') as HTMLDivElement,
  notificationCount: document.querySelector('#notif-count') as HTMLSpanElement,
  offcanvasEl: document.querySelector('#notificationOffcanvas'),
  canvasClose: document.querySelector<HTMLButtonElement>(
    '.offcanvas-header .btn-close'
  ),
  loaderContainer: document.querySelector('#loaderContainer') as HTMLDivElement,
  sentinel: document.querySelector('#sentinel'),
};

export default notificationSelection;
