import{a as m}from"./interceptor-yiU4mIN_.js";import{c as d}from"./config-vXPTaLOK.js";import{T as y}from"./index-C0eOhpfv.js";const r={notificationBell:document.querySelector(".notif-bell"),notificationList:document.querySelector("#notif-list"),notificationCount:document.querySelector("#notif-count"),offcanvasEl:document.querySelector("#notificationOffcanvas"),canvasClose:document.querySelector(".offcanvas-header .btn-close"),loaderContainer:document.querySelector("#loaderContainer"),sentinel:document.querySelector("#sentinel")},b=e=>{const t=e.seen?"":"bg-light",a=e.isCancelled?"bg-danger-subtle":"",i=new Date(e.createdAt).toLocaleString();let s="",n="";return e.type==="pendingShipment"&&(!e.isShipped&&!e.isCancelled&&(s=`
        <div class="mt-2 d-flex gap-2">

          <button 
            class="btn btn-sm ship-button"
            data-id="${e.transactionId}">
            <i class="fa-solid fa-truck-fast"></i> Ship
          </button>

          <button 
            class="btn btn-sm cancel-button"
            style="background-color: #864a5b;"
            data-id="${e.transactionId}">
             <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
      `),e.isShipped&&(n=`Shipped By: ${e.reportedByName}`),e.isCancelled&&(n=`Cancelled By: ${e.reportedByName}`)),`
 <div class="${e.type} notif-item border-bottom py-2 px-3 ${a} ${t}">
    <div class="fw-semibold mb-2">
    ${e.title||"Notification"}
    </div>
    <p class="mb-1 small text-muted">
    ${e.message}
    </p>

    <p class="mb-1 small">
    ${n}
    </p>
    
    ${s}

    <div class="d-flex align-items-center mt-2 mb-2">
      <img 
        src="${e.performedByImage||"../../../assets/images/icon.png"}"
        alt="Profile"
        class="rounded-circle me-3"
        width="40"
        height="40"
        style="object-fit: cover;"
      />

      <div class="d-flex flex-column">
        <span>
          ${e.performedByName}
        </span>
        <small>${i}</small>
      </div>
    </div>
  </div>
  `},l=new y,o=document.getElementById("toastSection");function g(e){const t="=".repeat((4-e.length%4)%4),a=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=atob(a),s=new Uint8Array(i.length);for(let n=0;n<i.length;++n)s[n]=i.charCodeAt(n);return s}async function w(){try{if(await Notification.requestPermission()!=="granted")return;const t=await navigator.serviceWorker.register("/sw.js");await navigator.serviceWorker.ready;let a=await t.pushManager.getSubscription();return a||(a=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:g(d.VAPID_PUBLIC_KEY)})),await m.post(`${d.NOTIFICATION_BASE_URL}/subscribe`,a.toJSON(),{headers:{"Content-Type":"application/json"}}),a}catch(e){o.innerHTML=l.errorToast(e.message),setTimeout(()=>o.innerHTML="",3e3)}}async function T(e){r.loaderContainer.style.display="block";try{const t=await m.get(`${d.NOTIFICATION_BASE_URL}/${e}`);if(!t.data.success)throw new Error("Error loading notifications");const a=t.data.data||[],i=t.data.unseenCount;i>0?(r.notificationCount.textContent=i,r.notificationCount.style.display="inline-block"):(r.notificationCount.textContent=0,r.notificationCount.style.display="none"),h(a,e)}catch(t){o.innerHTML=l.errorToast(t.message),setTimeout(()=>o.innerHTML="",3e3)}finally{r.loaderContainer.style.display="none"}}async function h(e,t){try{t===0&&(r.notificationList.innerHTML=""),e.forEach(s=>{r.notificationList.innerHTML+=b(s)}),document.querySelectorAll(".ship-button").forEach(s=>{s.addEventListener("click",async n=>{const u=n.target.dataset.id;if(u)try{n.target.innerText="Shipped",n.target.disabled=!0;const c=s.parentElement.querySelector(".cancel-button");c&&(c.disabled=!0),await m.patch(`${d.NOTIFICATION_BASE_URL}/change-shipment-status/${u}`)}catch(c){o.innerHTML=l.errorToast(c.message),setTimeout(()=>o.innerHTML="",3e3)}})}),document.querySelectorAll(".cancel-button").forEach(s=>{s.addEventListener("click",async n=>{const u=n.target.dataset.id;if(u)try{n.target.innerText="Cancelled",n.target.disabled=!0;const c=s.parentElement.querySelector(".ship-button");c&&(c.disabled=!0),await m.patch(`${d.NOTIFICATION_BASE_URL}/cancel-shipment/${u}`)}catch(c){o.innerHTML=l.errorToast(c.message),setTimeout(()=>o.innerHTML="",3e3)}})})}catch(a){o.innerHTML=l.errorToast(a.message),setTimeout(()=>o.innerHTML="",3e3)}}async function $(){try{if(r.notificationCount.innerHTML==0)return;await m.put(`${d.NOTIFICATION_BASE_URL}/mark-all-seen`),r.notificationCount.style.display="none"}catch(e){o.innerHTML=l.errorToast(e.message),setTimeout(()=>o.innerHTML="",3e3)}}let p=!1;const C=async e=>{for(const t of e)if(t.isIntersecting&&!p){p=!0,r.loaderContainer.style.display="block";const a=r.notificationList.children.length;await T(a),r.loaderContainer.style.display="none",p=!1}},S=new IntersectionObserver(C,{root:document.querySelector(".offcanvas-body"),rootMargin:"0px",threshold:.1}),f=document.querySelector("#sentinel");f&&S.observe(f);export{$ as m,r as n,w as r};
