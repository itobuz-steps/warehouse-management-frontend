import '../../../scss/user-management.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import {
  getUserDetailsSubscribe,
  deleteUserSubscribe,
  updateUserSubscribe,
} from './userManagementSubscribe.js';
import userManagementSelection from './userManagementSelector.js';

document.addEventListener('DOMContentLoaded', getUserDetailsSubscribe);

userManagementSelection.confirmDelete.addEventListener('click', async () => {
  await deleteUserSubscribe();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '../src/pages/login.html';
});

userManagementSelection.updateProfileForm.addEventListener(
  'submit',
  updateUserSubscribe
);
