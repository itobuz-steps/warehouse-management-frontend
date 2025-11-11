const userManagementSelection = {
    userImg: document.querySelector(".user-avatar-lg"),        
    userName: document.querySelector(".user-name"),
    userEmail: document.querySelector(".user-email"),
    userRole: document.querySelector(".user-role-badge"),
    btnDelete: document.querySelector(".btn-delete"),
    btnEdit: document.querySelector(".btn-edit"),
    verifiedManagerGrid: document.querySelector("#verified-manager-grid"),
    notVerifiedManagerGrid: document.querySelector("#not-verified-manager-grid"),
    createdAt: document.querySelector(".created-at"),
    updatedAt: document.querySelector(".updated-at"),
    managerView: document.querySelectorAll(".manager-list-section"),
    deleteOk: document.querySelector("#confirmDelete")
}

export default userManagementSelection;
