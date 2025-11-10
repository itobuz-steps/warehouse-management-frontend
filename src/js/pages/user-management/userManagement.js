import { getUserDetailsSubscribe, deleteUserSubscribe, updateUserSubscribe} from "./userManagementSubscribe.js";
import userManagementSelection from "./userManagementSelector.js";

document.addEventListener("DOMContentLoaded", getUserDetailsSubscribe);

userManagementSelection.btnDelete.addEventListener("click", deleteUserSubscribe);
userManagementSelection.btnEdit.addEventListener("click", updateUserSubscribe);


