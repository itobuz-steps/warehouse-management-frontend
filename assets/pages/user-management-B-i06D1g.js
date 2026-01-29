import"../modulepreload-polyfill-B5Qt9EMX.js";import{a as S}from"../injectNotificationCanvas-CJgnyuul.js";import{M as y}from"../bootstrap.esm-C02OvDcj.js";import{a as o}from"../interceptor-D8J117qD.js";import{c as d}from"../config-D1K7ByuX.js";import{T as f}from"../index-C0eOhpfv.js";const e={userImg:document.querySelector(".user-avatar-lg"),userName:document.querySelector(".user-name"),userEmail:document.querySelector(".user-email"),emailInput:document.getElementById("email"),userRole:document.querySelector(".user-role-badge"),btnDelete:document.querySelector(".btn-delete"),profileAvatar:document.getElementById("profileLabel"),activeButton:document.getElementById("activeBtn"),blockedButton:document.getElementById("blockedBtn"),pendingButton:document.getElementById("pendingBtn"),btnEdit:document.querySelector(".btn-edit"),activeManagerGrid:document.querySelector("#showActiveUser"),blockedManagerGrid:document.querySelector("#showBlockedUser"),pendingManagerGrid:document.querySelector("#showPendingUser"),emptyBlockedSection:document.getElementById("emptyBlocked"),createdAt:document.querySelector(".created-at"),updatedAt:document.querySelector(".updated-at"),managerView:document.querySelectorAll(".manager-list-section"),confirmUpdate:document.querySelector("#confirmUpdate"),profileImg:document.querySelector("#profileImg"),addManagerForm:document.getElementById("addManagerForm"),addManagerBtn:document.querySelector(".add-manager-btn"),toggleBtns:document.querySelector(".btn-group"),name:document.getElementById("name"),updateProfileForm:document.querySelector("#updateProfile"),toastSection:document.getElementById("toastSection"),lastLogin:document.getElementById("lastLogin"),warehouseSection:document.getElementById("showWarehouses")};function T(){e.userName.innerHTML="",e.userEmail.innerHTML="",e.lastLogin.innerHTML="",e.userImg.src="",e.userRole.innerHTML="",e.createdAt.innerHTML="",e.updatedAt.innerHTML="",e.activeManagerGrid.innerHTML="",e.blockedManagerGrid.innerHTML="",e.pendingManagerGrid.innerHTML=""}function b(a){T(),e.userName.innerHTML=a.name,e.userRole.innerHTML=a.role,e.userRole.style.textTransform="capitalize",e.userEmail.innerHTML+=`<i class="fa-solid fa-envelope mail"></i> ${a.email}`,e.profileAvatar.style.backgroundImage=`url(${a.profileImage})`,e.userImg.src=a.profileImage,e.createdAt.innerHTML=new Date(a.createdAt).toDateString(),e.updatedAt.innerHTML=new Date(a.updatedAt).toDateString(),e.lastLogin.innerHTML=new Date(a.lastLogin).toDateString()}const w=(a,t)=>`
  <div class="warehouse-card card mt-3 h-100 d-flex flex-column">
  <div class="card-body flex-grow-1">
    <h5 class="card-title warehouse-name mb-1">${a.name}</h5>

    <p class="warehouse-detail mb-1">
      <i class="fa-solid fa-location-dot text-danger me-2"></i>
      <span class="location-text">${a.address}</span>
    </p>

    <div class="warehouse-detail scrollable-description mb-2">
      <i class="fa-solid fa-circle-info text-muted me-2 align-top"></i>
      <span class="description-text">${a.description}</span>
    </div>

    <div class="warehouse-detail mt-2">
      <span class="me-2">Stock Level:</span>
      <span class="storage p-1 px-2 rounded ${t.toLowerCase()}">
        ${t}
      </span>
    </div>

    <div class="mt-auto pt-1">
      <a
        href="/pages/products.html?warehouseId=${a._id}&filter=warehouses"
        class="btn warehouse-button w-100"
      >
        View Products
      </a>
    </div>
  </div>
</div>`,L=a=>`<div class="user-card p-3 p-sm-4">
          <div class="user-header">
            <div class="user-avatar me-2">
              <img
                src="${a.profileImage}"
                alt=""
                class="w-100 h-100 rounded-circle border border-light-subtle"
              />
            </div>
            <div class="user-info flex-fill">
              <div class="user-name">${a.managerName}</div>
              <div class="user-creation">Created on ${a.createdOn}</div>
            </div>
          </div>

          <div class="user-details">
            <p class="user-email mb-1">
              <i class="fas fa-envelope"></i>
              ${a.managerEmail}
            </p>
            <p class="user-email">
              <i class="fas fa-user"></i>
              Last Login on ${a.lastLogin}
            </p>
          </div>

          ${a.isActive?`<button class="btn-view w-100" onclick="changeStatus('${a.managerId}')">Block User</button>`:`<button class="btn-view w-100" onclick="changeStatus('${a.managerId}')">Unblock User</button>`}
        </div>
`,h=(a,t="Unverified Manager",s,n,i="../../assets/images/profile_default.svg")=>`<div class="user-card p-3 p-sm-4">
          <div class="user-header">
            <div class="user-avatar me-2">
              <img
                src="${i}"
                alt=""
                class="w-100 h-100 rounded-circle border border-light-subtle"
              />
            </div>
            <div class="user-info flex-fill">
              <div class="user-name">${t}</div>
              <div class="user-creation">Created on ${n}</div>
            </div>
          </div>

          <div class="user-details">
            <p class="user-email">
              <i class="fas fa-envelope"></i>
              ${s}
            </p>
          </div>

          <button class="btn-view w-100" onclick = "sendInviteAgain('${s}')">Invite Again</button>
        </div>`,p=()=>`<div class="manager-card">
            <div class="manager-info">
                <p class="fw-semibold">No Managers Found</p>
            </div>
          </div>`;function I(a){let t=0,s=0;a.forEach(n=>{const i=new Date(n.lastLogin).toLocaleDateString(),c=new Date(n.createdAt).toLocaleDateString(),g={managerId:n._id,managerName:n.name,managerEmail:n.email,lastLogin:i,createdOn:c,isActive:n.isActive,profileImage:n.profileImage||"../../assets/images/profile_default.svg"};if(n.isActive){s+=1;const r=L(g);e.activeManagerGrid.innerHTML+=r}else{t+=1;const r=L(g);e.blockedManagerGrid.innerHTML+=r}}),t||(e.blockedManagerGrid.innerHTML=p()),s||(e.activeManagerGrid.innerHTML=p())}function E(a){a.length?a.forEach(t=>{const s=new Date(t.createdAt).toLocaleDateString(),n=h(t._id,t.name,t.email,s,t.profileImage);e.pendingManagerGrid.innerHTML+=n}):e.pendingManagerGrid.innerHTML=p()}const H=new f,v=async()=>{try{const a=await o.get(`${d.PROFILE_BASE_URL}/`),t=a.data.data.user,s=a.data.data.verifiedManagers,n=a.data.data.unverifiedManagers;if(b(t),t.role==="admin")e.addManagerBtn.classList.remove("d-none"),e.toggleBtns.classList.remove("d-none"),I(s),E(n);else if(t.role==="manager"){e.warehouseSection.classList.remove("d-none"),document.getElementById("managerTitle").classList.remove("d-none");const i=await S();i.length||(e.warehouseSection.innerHTML="No warehouse assigned yet"),i.forEach(async c=>{const r=(await o.get(`${d.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${c._id}`)).data.data.percentage;let l;r<50?l="LOW":r>=50&&r<=80?l="MODERATE":r>80&&(l="HIGH"),e.warehouseSection.innerHTML+=w(c,l)})}}catch(a){e.toastSection.innerHTML=H.errorToast(a.message)}finally{setTimeout(()=>{e.toastSection.innerHTML=""},3e3)}},u=new f,B=document.getElementById("updateProfileModal"),A=new y(B),M=document.getElementById("updateSpinner"),$=async a=>{a.preventDefault();const t=new FormData(e.updateProfileForm);try{const s=await o.patch(`${d.PROFILE_BASE_URL}/update-profile`,t,{headers:{"Content-Type":"multipart/form-data"}});M.classList.remove("d-none"),A.hide(),e.updateProfileForm.reset(),await v(),M.classList.add("d-none"),e.toastSection.innerHTML=u.successToast(s.data.message)}catch(s){e.toastSection.innerHTML=u.errorToast(s.response.data.message)}finally{setTimeout(()=>{e.toastSection.innerHTML=""},3e3)}},D=()=>{const a=e.profileImg.files[0];e.confirmUpdate.disabled=!1,a&&(e.profileAvatar.style.backgroundImage=`url("${URL.createObjectURL(a)}")`)};async function k(a){try{const t=await o.patch(`${d.PROFILE_BASE_URL}/change-user-status/${a}`);await v(),e.toastSection.innerHTML=u.successToast(t.data.message)}catch(t){e.toastSection.innerHTML=u.errorToast(t.response.message)}}window.changeStatus=k;function U(){e.activeButton.checked&&e.activeManagerGrid.classList.remove("d-none"),e.activeButton.addEventListener("click",()=>{e.activeManagerGrid.classList.remove("d-none"),e.blockedManagerGrid.classList.add("d-none"),e.pendingManagerGrid.classList.add("d-none")}),e.blockedButton.addEventListener("click",()=>{e.blockedManagerGrid.classList.remove("d-none"),e.activeManagerGrid.classList.add("d-none"),e.pendingManagerGrid.classList.add("d-none")}),e.pendingButton.addEventListener("click",()=>{e.pendingManagerGrid.classList.remove("d-none"),e.activeManagerGrid.classList.add("d-none"),e.blockedManagerGrid.classList.add("d-none")})}const m=new f,G=document.getElementById("addManagerModal"),_=new y(G);async function q(a){try{a.preventDefault();const s=new FormData(a.target).get("email"),n=await o.post(`${d.AUTH_BASE_URL}/signup`,{email:s});_.hide(),e.addManagerForm.reset(),e.toastSection.innerHTML=m.successToast(n.data.message)}catch(t){e.toastSection.innerHTML=m.errorToast(t.response.data.message)}finally{setTimeout(()=>{e.toastSection.innerHTML=""},3e3)}}async function R(a){try{const t=await o.post(`${d.AUTH_BASE_URL}/signup`,{email:a});e.toastSection.innerHTML=m.successToast(t.data.message)}catch(t){e.toastSection.innerHTML=m.errorToast(t.response.data.message)}finally{setTimeout(()=>{e.toastSection.innerHTML=""},3e3)}}window.sendInviteAgain=R;U();document.addEventListener("DOMContentLoaded",v);e.addManagerForm.addEventListener("submit",q);e.updateProfileForm.addEventListener("submit",$);e.profileImg.addEventListener("change",D);
