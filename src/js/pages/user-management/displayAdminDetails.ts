import userManagementSelection from './userManagementSelector.js';
import {
  managerCard,
  unverifiedManagerCard,
  emptyCard,
} from '../../common/template/profileTemplate.js';
import type { User } from '../../types/user.js';

export function displayVerifiedManagerCard(verifiedManagers: User[]) {
  let blockedManagerCount = 0;
  let activeManagerCount = 0;

  verifiedManagers.forEach((manager) => {
    if (manager.lastLogin === undefined) {
      manager.lastLogin = new Date();
    }

    if (manager.name === undefined || manager.name === null) {
      manager.name = 'No Name';
    }

    const lastLogin = new Date(manager.lastLogin).toLocaleDateString();
    const createdOn = new Date(manager.createdAt).toLocaleDateString();
    const cardData: {
      managerId: string;
      managerName: string;
      managerEmail: string;
      lastLogin: Date;
      createdOn: string;
      isActive: boolean;
      profileImage: string;
    } = {
      managerId: manager._id,
      managerName: manager.name,
      managerEmail: manager.email,
      lastLogin: new Date(lastLogin),
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

export function displayPendingManagerCard(unverifiedManagers: User[]) {
  if (unverifiedManagers.length) {
    unverifiedManagers.forEach((manager) => {
      const createdOn = new Date(manager.createdAt).toLocaleDateString();

      if (manager.name === undefined || manager.name === null) {
        manager.name = 'No Name';
      }
      if (manager.profileImage === undefined || manager.profileImage === null) {
        manager.profileImage = '../../assets/images/profile_default.svg';
      }

      const card = unverifiedManagerCard(
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
