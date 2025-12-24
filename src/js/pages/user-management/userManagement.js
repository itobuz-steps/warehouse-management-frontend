import '../../../scss/user-management.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import { getUserDetailsSubscribe } from './userManagementSubscribe.js';
import { updateUserSubscribe } from './updateProfile.js';
import userManagementSelection from './userManagementSelector.js';

document.addEventListener('DOMContentLoaded', getUserDetailsSubscribe);

// update profile
userManagementSelection.updateProfileForm.addEventListener(
  'submit',
  updateUserSubscribe
);
