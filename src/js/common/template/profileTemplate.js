const verifiedManagerCard = (
  name,
  email,
  lastLogin,
  isActive,
  profileImage = '../../assets/images/profile_default.svg'
) => {
  return `<div class="manager-card">
  <img src="${profileImage}" alt="Manager" class="manager-avatar" />

  <div class="manager-info">
    <div class="manager-header">
      <h5 class="manager-name">${name}</h5>
      <i class="fas fa-check-circle verified"></i>
    </div>

    <p class="manager-email">${email}</p>

    <p class="manager-last-login">
      <i class="far fa-clock"></i> Last Login: ${lastLogin}
    </p>


    ${
      isActive
        ? `
      <button class="block-user-btn">
        <i class="fas fa-ban"></i> Block User
      </button>
    `
        : `
      <button class="unblock-user-btn">
        <i class="fas fa-unlock"></i> Unblock User
      </button>
    `
    }
  </div>
</div>
`;
};

const unverifiedManagerCard = (
  email,
  profileImage = '../../assets/images/profile_default.svg'
) => {
  return `<div class="manager-card">
            <img
              src=${profileImage}
              alt="Manager"
              class="manager-avatar"
            />
            <div class="manager-info">
                <p class="manager-email">${email}</p>
            </div>
          </div>`;
};

const emptyCard = () => {
  return `<div class="manager-card">
            <div class="manager-info">
                <p class="manager-email">No Managers Found</p>
            </div>
          </div>`;
};

export { verifiedManagerCard, unverifiedManagerCard, emptyCard };
