const userManagementSelection = {
  userImg: document.querySelector('.user-avatar-lg') as HTMLImageElement,
  userName: document.querySelector('.user-name') as HTMLElement,
  userEmail: document.querySelector('.user-email') as HTMLElement,
  emailInput: document.getElementById('email') as HTMLElement,
  userRole: document.querySelector('.user-role-badge') as HTMLElement,
  btnDelete: document.querySelector('.btn-delete') as HTMLElement,
  profileAvatar: document.getElementById('profileLabel') as HTMLElement,
  activeButton: document.getElementById('activeBtn') as HTMLInputElement,
  blockedButton: document.getElementById('blockedBtn') as HTMLElement,
  pendingButton: document.getElementById('pendingBtn') as HTMLElement,
  btnEdit: document.querySelector('.btn-edit') as HTMLElement,
  activeManagerGrid: document.querySelector('#showActiveUser') as HTMLElement,
  blockedManagerGrid: document.querySelector('#showBlockedUser') as HTMLElement,
  pendingManagerGrid: document.querySelector('#showPendingUser') as HTMLElement,
  emptyBlockedSection: document.getElementById('emptyBlocked') as HTMLElement,
  createdAt: document.querySelector('.created-at') as HTMLElement,
  updatedAt: document.querySelector('.updated-at') as HTMLElement,
  managerView: document.querySelectorAll(
    '.manager-list-section'
  ) as NodeListOf<HTMLElement>,
  confirmUpdate: document.querySelector('#confirmUpdate') as HTMLButtonElement,
  profileImg: document.querySelector('#profileImg') as HTMLInputElement,
  addManagerForm: document.getElementById('addManagerForm') as HTMLFormElement,
  addManagerBtn: document.querySelector('.add-manager-btn') as HTMLElement,
  toggleBtns: document.querySelector('.btn-group') as HTMLElement,
  name: document.getElementById('name') as HTMLElement,
  updateProfileForm: document.querySelector(
    '#updateProfile'
  ) as HTMLFormElement,
  toastSection: document.getElementById('toastSection') as HTMLElement,
  lastLogin: document.getElementById('lastLogin') as HTMLElement,
  warehouseSection: document.getElementById('showWarehouses') as HTMLElement,
};

export default userManagementSelection;
