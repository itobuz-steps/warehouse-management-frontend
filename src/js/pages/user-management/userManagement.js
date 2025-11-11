import { getUserDetailsSubscribe, deleteUserSubscribe, updateUserSubscribe} from "./userManagementSubscribe.js";
import userManagementSelection from "./userManagementSelector.js";

document.addEventListener("DOMContentLoaded", getUserDetailsSubscribe);

userManagementSelection.btnEdit.addEventListener("click", updateUserSubscribe);

console.log(userManagementSelection.deleteOk);

userManagementSelection.deleteOk.addEventListener("click", async () => {
  await deleteUserSubscribe();
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "../pages/login.html";
});
