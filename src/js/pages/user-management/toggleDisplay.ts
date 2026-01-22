import userManagementSelection from './userManagementSelector.js';

export default function toggleDisplay() {
  if (userManagementSelection.activeButton.checked) {
    userManagementSelection.activeManagerGrid.classList.remove('d-none');
  }

  userManagementSelection.activeButton.addEventListener('click', () => {
    userManagementSelection.activeManagerGrid.classList.remove('d-none');
    userManagementSelection.blockedManagerGrid.classList.add('d-none');
    userManagementSelection.pendingManagerGrid.classList.add('d-none');
  });

  userManagementSelection.blockedButton.addEventListener('click', () => {
    userManagementSelection.blockedManagerGrid.classList.remove('d-none');
    userManagementSelection.activeManagerGrid.classList.add('d-none');
    userManagementSelection.pendingManagerGrid.classList.add('d-none');
  });

  userManagementSelection.pendingButton.addEventListener('click', () => {
    userManagementSelection.pendingManagerGrid.classList.remove('d-none');
    userManagementSelection.activeManagerGrid.classList.add('d-none');
    userManagementSelection.blockedManagerGrid.classList.add('d-none');
  });
}
