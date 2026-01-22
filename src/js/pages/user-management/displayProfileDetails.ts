import type { User } from '../../types/user.js';
import userManagementSelection from './userManagementSelector.js';

function clearProfileData() {
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
}

export default function displayProfile(user: User) {
  clearProfileData();
  //profile operations
  userManagementSelection.userName.innerHTML = user.name; //set name to profile card
  userManagementSelection.userRole.innerHTML = user.role; //set role to profile card
  userManagementSelection.userRole.style.textTransform = 'capitalize'; // make role capitalize

  userManagementSelection.userEmail.innerHTML += `<i class="fa-solid fa-envelope mail"></i> ${user.email}`; // set email to profile card
  userManagementSelection.profileAvatar.style.backgroundImage = `url(${user.profileImage})`; // profile card image label

  if (user.profileImage) {
    userManagementSelection.profileImg.setAttribute('src', user.profileImage);
  } else {
    userManagementSelection.profileImg.setAttribute(
      'src',
      '../../assets/images/profile_default.svg'
    );
  }

  userManagementSelection.createdAt.innerHTML = new Date(
    user.createdAt
  ).toDateString();
  userManagementSelection.updatedAt.innerHTML = new Date(
    user.updatedAt
  ).toDateString();

  if (user.lastLogin) {
    userManagementSelection.lastLogin.innerHTML = new Date(
      user.lastLogin
    ).toDateString();
  }
}
