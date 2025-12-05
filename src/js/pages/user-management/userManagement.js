import '../../../scss/user-management.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import { getUserDetailsSubscribe } from './userManagementSubscribe.js';
import { updateUserSubscribe } from './updateProfile.js';
import { deleteUserSubscribe } from './deleteUser.js';
import userManagementSelection from './userManagementSelector.js';

document.addEventListener('DOMContentLoaded', getUserDetailsSubscribe);

//delete profile
userManagementSelection.confirmDelete.addEventListener('click', async () => {
  await deleteUserSubscribe();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '../pages/login.html';
});

// update profile
userManagementSelection.updateProfileForm.addEventListener(
  'submit',
  updateUserSubscribe
);
