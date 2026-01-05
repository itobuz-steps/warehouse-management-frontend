import userManagementSelection from './userManagementSelector.js';

export default function clearProfileData() {
  userManagementSelection.userName.innerHTML = '';
  userManagementSelection.userEmail.innerHTML = '';
  userManagementSelection.lastLogin.innerHTML = '';
  userManagementSelection.userImg.src = '';
  userManagementSelection.userRole.innerHTML = '';
  userManagementSelection.createdAt.innerHTML = '';
  userManagementSelection.updatedAt.innerHTML = '';
  userManagementSelection.activeManagerGrid.innerHTML = '';
  userManagementSelection.blockedManagerGrid.innerHTML = '';
  userManagementSelection.pendingManagerGrid.innerHTML = '';
  userManagementSelection.warehouseGrid.innerHTML = '';
}
