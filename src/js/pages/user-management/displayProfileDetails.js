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

export default function displayProfile(user) {
  clearProfileData();
  //profile operations
  userManagementSelection.userName.innerHTML = user.name; //set name to profile card
  userManagementSelection.userRole.innerHTML = user.role; //set role to profile card
  userManagementSelection.userRole.style.textTransform = 'capitalize'; // make role capitalize

  userManagementSelection.userEmail.innerHTML += `<i class="fa-solid fa-envelope mail"></i> ${user.email}`; // set email to profile card
  userManagementSelection.profileAvatar.style.backgroundImage = `url(${user.profileImage})`; // profile card image label
  userManagementSelection.userImg.src = user.profileImage; // profile card modal open avatar

  userManagementSelection.createdAt.innerHTML = new Date(
    user.createdAt
  ).toDateString();
  userManagementSelection.updatedAt.innerHTML = new Date(
    user.updatedAt
  ).toDateString();
  userManagementSelection.lastLogin.innerHTML = new Date(
    user.lastLogin
  ).toDateString();
}
