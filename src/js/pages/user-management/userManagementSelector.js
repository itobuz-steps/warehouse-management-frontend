const userManagementSelection = {
  userImg: document.querySelector('.user-avatar-lg'),
  userName: document.querySelector('.user-name'),
  userEmail: document.querySelector('.user-email'),
  userRole: document.querySelector('.user-role-badge'),
  btnDelete: document.querySelector('.btn-delete'),
  btnEdit: document.querySelector('.btn-edit'),
  verifiedManagerGrid: document.querySelector('#verified-manager-grid'),
  notVerifiedManagerGrid: document.querySelector('#not-verified-manager-grid'),
  createdAt: document.querySelector('.created-at'),
  updatedAt: document.querySelector('.updated-at'),
  managerView: document.querySelectorAll('.manager-list-section'),
  confirmDelete: document.querySelector('#confirmDelete'),
  confirmUpdate: document.querySelector('#confirmUpdate'),
  profileImg: document.querySelector('#profileImg'),
  name: document.querySelector('#name'),
  updateProfileForm: document.querySelector('#updateProfile'),

  warehouseDetailsSelection: document.querySelector('.warehouse-list-section'),
  warehouseGrid: document.querySelector('.warehouse-grid'),
  noWarehouseParagraph: document.querySelector('.warehouse-list-section p'),
};

export default userManagementSelection;
