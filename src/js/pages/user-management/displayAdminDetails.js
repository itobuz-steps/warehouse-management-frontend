import userManagementSelection from './userManagementSelector.js';
import {
  managerCard,
  unverifiedManagerCard,
  emptyCard,
} from '../../common/template/profileTemplate.js';

export function displayVerifiedManagerCard(verifiedManagers) {
  let blockedManagerCount = 0;
  let activeManagerCount = 0;

  verifiedManagers.forEach((manager) => {
    const lastLogin = new Date(manager.lastLogin).toLocaleDateString();
    const createdOn = new Date(manager.createdAt).toLocaleDateString();
    const cardData = {
      managerId: manager._id,
      managerName: manager.name,
      managerEmail: manager.email,
      lastLogin,
      createdOn,
      isActive: manager.isActive,
      profileImage:
        manager.profileImage || '../../assets/images/profile_default.svg',
    };

    if (manager.isActive) {
      activeManagerCount += 1;
      const card = managerCard(cardData);

      userManagementSelection.activeManagerGrid.innerHTML += card;
    } else {
      blockedManagerCount += 1;
      const card = managerCard(cardData);

      userManagementSelection.blockedManagerGrid.innerHTML += card;
    }
  });

  if (!blockedManagerCount) {
    userManagementSelection.blockedManagerGrid.innerHTML = emptyCard();
  }

  if (!activeManagerCount) {
    userManagementSelection.activeManagerGrid.innerHTML = emptyCard();
  }
}

export function displayPendingManagerCard(unverifiedManagers) {
  if (unverifiedManagers.length) {
    unverifiedManagers.forEach((manager) => {
      const createdOn = new Date(manager.createdAt).toLocaleDateString();

      const card = unverifiedManagerCard(
        manager._id,
        manager.name,
        manager.email,
        createdOn,
        manager.profileImage
      );

      userManagementSelection.pendingManagerGrid.innerHTML += card;
    });
  } else {
    userManagementSelection.pendingManagerGrid.innerHTML = emptyCard();
  }
}
