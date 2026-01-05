import '../../../scss/user-management.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import { getUserDetailsSubscribe } from './userManagementSubscribe.js';
import { updateUserSubscribe, profileImagePreview } from './updateProfile.js';
import userManagementSelection from './userManagementSelector.js';
import toggleDisplay from './toggleDisplay.js';
import sendInvite from './inviteManager.js';

//handle toggle of button group
toggleDisplay();

// load page data
document.addEventListener('DOMContentLoaded', getUserDetailsSubscribe);

//invite manager
userManagementSelection.addManagerForm.addEventListener('submit', sendInvite);

// update profile
userManagementSelection.updateProfileForm.addEventListener(
  'submit',
  updateUserSubscribe
);

// preview Profile image
userManagementSelection.profileImg.addEventListener(
  'change',
  profileImagePreview
);
