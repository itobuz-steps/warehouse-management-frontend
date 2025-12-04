const verifiedManagerCard = (
  name,
  email,
  profileImage = '../../assets/images/profile_default.svg',
  lastLogin
) => {
  return `<div class="manager-card">
  <img src="${profileImage}" alt="Manager" class="manager-avatar" />

  <div class="manager-info">
    <div class="manager-header">
      <h5 class="manager-name">${name}</h5>
      <i class="fas fa-check-circle verified"></i>
    </div>

    <p class="manager-email">${email}</p>

    <!-- NEW: Last Login -->
    <p class="manager-last-login">
      <i class="far fa-clock"></i> Last Login: ${lastLogin}
    </p>

    <!-- NEW: Block User Button -->
    <button class="block-user-btn">
      <i class="fas fa-ban"></i> Block User
    </button>
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

export { verifiedManagerCard, unverifiedManagerCard };
