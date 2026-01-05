const managerCard = (
  id,
  name,
  email,
  lastLogin,
  createdOn,
  isActive,
  profileImage = '../../assets/images/profile_default.svg'
) => {
  return `<div class="user-card p-3 p-sm-4">
          <div class="user-header">
            <div class="user-avatar me-2">
              <img
                src="${profileImage}"
                alt=""
                class="w-100 rounded-circle border border-light-subtle"
              />
            </div>
            <div class="user-info flex-fill">
              <div class="user-name">${name}</div>
              <div class="user-creation">Created on ${createdOn}</div>
            </div>
          </div>

          <div class="user-details">
            <p class="user-email mb-1">
              <i class="fas fa-envelope"></i>
              ${email}
            </p>
            <p class="user-email">
              <i class="fas fa-user"></i>
              Last Login on ${lastLogin}
            </p>
          </div>

          ${
            isActive
              ? `<button class="btn-view w-100" onclick="changeStatus('${id}')">Block User</button>`
              : `<button class="btn-view w-100" onclick="changeStatus('${id}')">Unblock User</button>`
          }
        </div>
`;
};

const unverifiedManagerCard = (
  id,
  name = 'Unverified Manager',
  email,
  createdOn,
  profileImage = '../../assets/images/profile_default.svg'
) => {
  return `<div class="user-card p-3 p-sm-4">
          <div class="user-header">
            <div class="user-avatar me-2">
              <img
                src="${profileImage}"
                alt=""
                class="w-100 rounded-circle border border-light-subtle"
              />
            </div>
            <div class="user-info flex-fill">
              <div class="user-name">${name}</div>
              <div class="user-creation">Created on ${createdOn}</div>
            </div>
          </div>

          <div class="user-details">
            <p class="user-email">
              <i class="fas fa-envelope"></i>
              ${email}
            </p>
          </div>

          <button class="btn-view w-100" onclick = "sendInviteAgain('${email}')">Invite Again</button>
        </div>`;
};

const emptyCard = () => {
  return `<div class="manager-card">
            <div class="manager-info">
                <p class="fw-semibold">No Managers Found</p>
            </div>
          </div>`;
};

export { managerCard, unverifiedManagerCard, emptyCard };
