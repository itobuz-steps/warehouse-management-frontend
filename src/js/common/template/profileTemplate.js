const verifiedManagerCard = (name, email, profileImage) => {
  if (profileImage === 'http://localhost:3000/uploads/user/') {
    profileImage = 'assets/images/profile_default.svg';
  }
  return `<div class="manager-card">
            <img
              src=${profileImage}
              alt="Manager"
              class="manager-avatar"
            />
            <div class="manager-info">
                <span>
                <h5 class="manager-name d-inline-block">${name}</h5>
                <i class="fas fa-check-circle fs-6" style="color: #1da1f2;"></i>
                </span>

                <p class="manager-email">${email}</p>
            </div>
          </div>`;
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
