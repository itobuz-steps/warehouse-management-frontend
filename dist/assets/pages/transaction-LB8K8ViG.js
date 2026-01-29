import"../modulepreload-polyfill-B5Qt9EMX.js";import{M as re}from"../bootstrap.esm-C02OvDcj.js";import{a as j,g as de}from"../injectNotificationCanvas-C6as7mfK.js";import{c as I}from"../config-D1K7ByuX.js";import{a as w}from"../interceptor-D8J117qD.js";import{T as G}from"../index-C0eOhpfv.js";import{h as ce}from"../productApiHelper-BmMB7QXX.js";const U=document.getElementById("sourceWarehouse"),W=document.getElementById("destinationWarehouse"),ie=document.getElementById("destinationWarehouseDropdownLabel");async function ue(){try{const e=await j();if(!e.length)return;U.innerHTML="<option selected disabled>Select Source Warehouse</option>",W.innerHTML="<option selected disabled>Select Destination Warehouse</option>",e.forEach(o=>{U.innerHTML+=`<option value="${o._id}">${o.name}</option>`,W.innerHTML+=`<option value="${o._id}">${o.name}</option>`})}catch(e){console.log(e.message)}}async function le(){try{ie.classList.remove("d-none"),W.classList.remove("d-none");const e=await j();if(!e.length)return;const o=U.value;W.innerHTML="<option selected disabled>Select Destination Warehouse</option>",e.forEach(t=>{t._id!==o&&(W.innerHTML+=`<option value="${t._id}">${t.name}</option>`)})}catch(e){console.log(e.message)}}const i={form:document.getElementById("transactionForm"),toastSection:document.getElementById("toastSection"),typeSelect:document.getElementById("transactionType"),sections:{IN:document.getElementById("inFields"),OUT:document.getElementById("outFields"),TRANSFER:document.getElementById("transferFields"),ADJUSTMENT:document.getElementById("adjustmentFields")},warehouseDropdown:document.getElementById("warehouseDropdown"),warehouseLabels:{source:document.getElementById("sourceWarehouseDropdownLabel"),destination:document.getElementById("destinationWarehouseDropdownLabel")},warehouses:{sourceWarehouse:document.getElementById("sourceWarehouse"),destinationWarehouse:document.getElementById("destinationWarehouse")},containers:{inProductsContainer:document.getElementById("inProductsContainer"),outProductsContainer:document.getElementById("outProductsContainer"),transferProductsContainer:document.getElementById("transferProductsContainer"),adjustProductsContainer:document.getElementById("adjustProductsContainer")},buttons:{addInProduct:document.getElementById("addInProduct"),addOutProduct:document.getElementById("addOutProduct"),addTransferProduct:document.getElementById("addTransferProduct")},addNewProduct:document.getElementById("addNewProductBtn"),submitTransactionBtn:document.getElementById("submitTransactionBtn")};function me(e,o){return`
    <div class="custom-dropdown">
      <button type="button"
              class="dropdown-toggle form-control text-start h-46"
              data-value="">
        <img src="" class="dropdown-thumb d-none" />
        <span>Select Product</span>
      </button>

      <div class="dropdown-menu p-2 border rounded bg-white shadow-sm"
           style="display:none; max-height:250px; overflow-y:auto;">
        ${e.map(t=>{const s=o?t:t.product,n=s.productImage?.[0]||"";return`
            <div class="dropdown-item d-flex align-items-center product-option"
                 data-id="${s._id}"
                 data-name="${s.name}"
                 data-img="${n}"
                 data-qty="${o?"":t.quantity}">
              <img src="${n}"
                   width="32"
                   height="32"
                   class="me-2"
                   style="object-fit:cover;border-radius:4px;">
              <span>
                ${s.name}${o?"":` (Quantity: ${t.quantity})`}
              </span>
            </div>
          `}).join("")}
      </div>
    </div>

    <input type="number"
           min="1"
           class="form-control quantityInput h-46"
           placeholder="Quantity"/>

    <input type="number"
           min="1"
           class="form-control limitInput h-46"
           placeholder="Limit"
           style="display:none"/>
  `}function pe(e,o){return e.map(t=>{const s=o?t:t.product,n=s.productImage?.[0]||"";return`
      <div class="dropdown-item d-flex align-items-center product-option"
           data-id="${s._id}"
           data-name="${s.name}"
           data-img="${n}"
           data-qty="${o?"":t.quantity}">
        <img src="${n}"
             width="32"
             height="32"
             class="me-2"
             style="object-fit:cover;border-radius:4px;">
        <span>
          ${s.name}${o?"":` (Quantity: ${t.quantity})`}
        </span>
      </div>
    `}).join("")}const{containers:K,warehouses:he}=i,{sourceWarehouse:ye,destinationWarehouse:R}=he,L={},X={};async function P(e){let o=null,t;switch(e){case"IN":t="inProductsContainer",o=R.value;break;case"OUT":case"TRANSFER":case"ADJUSTMENT":o=ye.value,t={OUT:"outProductsContainer",TRANSFER:"transferProductsContainer",ADJUSTMENT:"adjustProductsContainer"}[e];break;default:return}const s=K[t];s.innerHTML="<em>Loading products...</em>";try{let n=[],r=[];if(e==="IN")n=(await w.get(`${I.PRODUCT_BASE_URL}`)).data?.data.products||[],o&&o.trim()!==""&&(r=(await w.get(`${I.QUANTITY_BASE_URL}/warehouse-specific-products/${o}`)).data?.data||[]);else{if(!o||o.trim()===""){s.innerHTML="<p class='text-muted'>Please select a warehouse first.</p>",L[t]=[];return}n=(await w.get(`${I.QUANTITY_BASE_URL}/warehouse-specific-products/${o}`)).data?.data||[],r=n,e==="TRANSFER"&&R.value&&(r=(await w.get(`${I.QUANTITY_BASE_URL}/warehouse-specific-products/${R.value}`)).data?.data||[])}const m=new Set(r.map(d=>d.product?._id||d._id));if(s.innerHTML="",!n.length){s.innerHTML="<p class='text-muted'>No products available.</p>",L[t]=[];return}L[t]=n,X[t]=m,ee(s,n,m)}catch(n){console.error(n),s.innerHTML=`<p class="text-danger">Failed to load products: ${n.response?.data?.message||n.message}</p>`,L[t]=[]}}function F(e){const o=K[e],t=L[e],s=X[e];!o||!t||!t.length||ee(o,t,s)}function Z(e){return[...e.querySelectorAll(".dropdown-toggle")].map(o=>o.dataset.value).filter(o=>o)}function ee(e,o,t=new Set){const s=document.createElement("div");s.className="product-row mb-2 d-flex flex-column flex-sm-row";const n=o.length&&!o[0].product,r=Z(e),m=o.filter(h=>{let u;return n?u=h._id:u=h.product._id,!r.includes(u)});if(!m.length){s.innerHTML='<p class="text-warning">All products already selected.</p>',e.appendChild(s);return}s.innerHTML=me(m,n);const d=s.querySelector(".dropdown-toggle"),y=s.querySelector(".dropdown-menu"),l=s.querySelector(".dropdown-thumb"),a=s.querySelector(".limitInput");d.addEventListener("click",()=>{y.style.display=y.style.display==="none"?"block":"none"}),y.querySelectorAll(".product-option").forEach(h=>{h.addEventListener("click",()=>{const u=h.dataset.id,f=h.dataset.name,b=h.dataset.img||"",c=h.dataset.qty;d.dataset.value=u,n?d.querySelector("span").textContent=f:d.querySelector("span").textContent=`${f} (Quantity: ${c})`,b.trim()!==""?(l.src=b,l.classList.remove("d-none")):l.classList.add("d-none"),y.style.display="none",t.has(u)?a.style.display="none":a.style.display="block",te(e,o,n,t)})}),e.appendChild(s)}function te(e,o,t,s){const n=Z(e);e.querySelectorAll(".product-row").forEach(m=>{const d=m.querySelector(".dropdown-toggle"),y=d.dataset.value,l=m.querySelector(".dropdown-menu"),a=m.querySelector(".limitInput"),h=o.filter(u=>{const f=t?u._id:u.product._id;return!n.includes(f)||f===y});l.innerHTML=pe(h,t),l.querySelectorAll(".product-option").forEach(u=>{u.addEventListener("click",()=>{const f=u.dataset.id,b=u.dataset.name,c=u.dataset.img,p=u.dataset.qty;d.dataset.value=f,d.querySelector("span").textContent=t?b:`${b} (Quantity: ${p})`;const g=d.querySelector(".dropdown-thumb");c.trim()!==""?(g.src=c,g.classList.remove("d-none")):g.classList.add("d-none"),l.style.display="none",s.has(f)?a.style.display="none":a.style.display="block",te(e,o,t,s)})})})}const ge=document.getElementById("transactionType"),oe=document.getElementById("warehouseDropdown"),J=document.getElementById("transferOption"),x=document.getElementById("sourceWarehouseDropdownLabel"),k=document.getElementById("destinationWarehouseDropdownLabel"),v=document.getElementById("sourceWarehouse"),B=document.getElementById("destinationWarehouse"),{sections:N}=i;function fe(){Object.values(N).forEach(e=>e.classList.add("d-none"))}function Ie(){oe.classList.add("d-none"),x.classList.add("d-none"),k.classList.add("d-none"),v.classList.add("d-none"),B.classList.add("d-none"),v.onchange=null,B.onchange=null}async function Ee(){try{const e=await j();!e||e.length<2?J.setAttribute("disabled",""):J.removeAttribute("disabled")}catch(e){console.log(e.message)}}function H(){const e=ge.value;fe(),Ie(),e&&(oe.classList.remove("d-none"),e==="IN"?(k.classList.remove("d-none"),B.classList.remove("d-none"),B.onchange=()=>{i.buttons.addInProduct.removeAttribute("disabled"),i.addNewProduct.removeAttribute("disabled"),P("IN")},N.IN.classList.remove("d-none")):e==="OUT"?(x.classList.remove("d-none"),v.classList.remove("d-none"),v.onchange=()=>{i.buttons.addOutProduct.removeAttribute("disabled"),P("OUT")},N.OUT.classList.remove("d-none")):e==="ADJUSTMENT"?(x.classList.remove("d-none"),v.classList.remove("d-none"),v.onchange=()=>{P("ADJUSTMENT")},N.ADJUSTMENT.classList.remove("d-none")):e==="TRANSFER"&&(x.classList.remove("d-none"),v.classList.remove("d-none"),v.onchange=async()=>{await le()},B.onchange=async()=>{i.buttons.addTransferProduct.removeAttribute("disabled"),await P("TRANSFER")},k.classList.remove("d-none"),B.classList.remove("d-none"),N.TRANSFER.classList.remove("d-none")),ue())}class be{productTable=o=>o.length?`
      <h5 class="mb-3 text-secondary">
        <i class="fa-solid"></i>Products Summary
      </h5>
      <div class="summary-section border rounded mb-4">
        <table class="table table-borderless table-sm rounded">
          <thead class="table-success">
            <tr>
              <th class="pl-2" style="width:70%">Products</th>
              <th class="text-center" style="width:30%">Quantity</th>
            </tr>
          </thead>
          <tbody>${o.map(s=>`
        <tr>
          <td><i class=" me-1 text-secondary"></i>${s.name}</td>
          <td class="text-center">${s.qty}</td>
        </tr>
      `).join("")}</tbody>
        </table>
      </div>
    `:`
        <div class="p-3 rounded border bg-light mb-4">
          <p class="text-muted">No products added.</p>
        </div>
      `;stockInDetails=(o,t,s)=>`
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Stock In Details
        </h6>
        <p class="theme-color">Destination Warehouse: 
          <span class="badge badge-in">${o}</span>
        </p>
        <p class="theme-color">Supplier: <span>${t||"-"}</span></p>
        <p class="theme-color">Notes: <span>${s||"-"}</span></p>
      </div>
    `;stockOutDetails=(o,t,s)=>`
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Stock Out Details
        </h6>
        <p class="theme-color">Source Warehouse: 
          <span class="badge badge-out">${o}</span>
        </p>
        <p class="theme-color">Customer: <span>${t.name||"-"}</span></p>
        <p class="theme-color">Email: <span>${t.email||"-"}</span></p>
        <p class="theme-color">Phone: <span>${t.phone||"-"}</span></p>
        <p class="theme-color">Address: <span>${t.address||"-"}</span></p>
        <p class="theme-color">Notes: <span>${s||"-"}</span></p>
      </div>
    `;transferDetails=(o,t,s)=>`
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Transfer Details
        </h6>
        <p class="theme-color">Source Warehouse: 
          <span class="badge badge-transfer">${o}</span>
        </p>
        <p class="theme-color">Destination Warehouse: 
          <span class="badge badge-transfer">${t}</span>
        </p>
        <p class="theme-color">Notes: <span>${s||"-"}</span></p>
      </div>
    `;adjustmentDetails=(o,t,s)=>`
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Adjustment Details
        </h6>
        <p class="theme-color">Warehouse: 
          <span class="badge badge-adjust">${o}</span>
        </p>
        <p class="theme-color">Reason: <span>${t||"-"}</span></p>
        <p class="theme-color">Notes: <span>${s||"-"}</span></p>
      </div>
    `}const S=new be;async function ve(e){return new Promise(o=>{const t=document.getElementById("confirmTransactionModal"),s=document.getElementById("transactionSummary"),n=document.getElementById("confirmTransactionBtn");let r="";e==="IN"?r="inProductsContainer":e==="OUT"?r="outProductsContainer":e==="TRANSFER"?r="transferProductsContainer":e==="ADJUSTMENT"&&(r="adjustProductsContainer");const m=i.containers[r];let d=[];m&&(d=[...m.querySelectorAll(".product-row")]);const y=[];for(let c of d){const p=c.querySelector(".dropdown-toggle"),g=c.querySelector(".quantityInput"),D=g?parseInt(g.value||"0",10):0,Q=p?p.dataset.value:null,ae=p?p.querySelector("span").textContent.trim():"N/A";Q&&D>0&&y.push({productId:Q,name:ae,qty:D})}let l="";const{warehouses:a}=i;if(e==="IN"){let c="N/A";a.destinationWarehouse&&a.destinationWarehouse.options[a.destinationWarehouse.selectedIndex]&&(c=a.destinationWarehouse.options[a.destinationWarehouse.selectedIndex].text);const p=document.getElementById("supplier")?document.getElementById("supplier").value:"",g=document.getElementById("inNotes")?document.getElementById("inNotes").value:"";l=S.stockInDetails(c,p,g)}else if(e==="OUT"){let c="N/A";a.sourceWarehouse&&a.sourceWarehouse.options[a.sourceWarehouse.selectedIndex]&&(c=a.sourceWarehouse.options[a.sourceWarehouse.selectedIndex].text);const p={name:document.getElementById("customerName")?document.getElementById("customerName").value:"",email:document.getElementById("customerEmail")?document.getElementById("customerEmail").value:"",phone:document.getElementById("customerPhone")?document.getElementById("customerPhone").value:"",address:document.getElementById("customerAddress")?document.getElementById("customerAddress").value:""},g=document.getElementById("outNotes")?document.getElementById("outNotes").value:"";l=S.stockOutDetails(c,p,g)}else if(e==="TRANSFER"){let c="N/A";a.sourceWarehouse&&a.sourceWarehouse.options[a.sourceWarehouse.selectedIndex]&&(c=a.sourceWarehouse.options[a.sourceWarehouse.selectedIndex].text);let p="N/A";a.destinationWarehouse&&a.destinationWarehouse.options[a.destinationWarehouse.selectedIndex]&&(p=a.destinationWarehouse.options[a.destinationWarehouse.selectedIndex].text);const g=document.getElementById("transferNotes")?document.getElementById("transferNotes").value:"";l=S.transferDetails(c,p,g)}else if(e==="ADJUSTMENT"){let c="N/A";a.sourceWarehouse&&a.sourceWarehouse.options[a.sourceWarehouse.selectedIndex]&&(c=a.sourceWarehouse.options[a.sourceWarehouse.selectedIndex].text);const p=document.getElementById("adjustReason")?document.getElementById("adjustReason").value:"",g=document.getElementById("adjustNotes")?document.getElementById("adjustNotes").value:"";l=S.adjustmentDetails(c,p,g)}s.innerHTML=S.productTable(y)+l;const h=new re(t);h.show();const u=()=>{b(),h.hide(),o(!0)},f=()=>{b(),o(!1)},b=()=>{n.removeEventListener("click",u),t.removeEventListener("hidden.bs.modal",f)};n.addEventListener("click",u),t.addEventListener("hidden.bs.modal",f)})}const Y=new G,{toastSection:V,warehouses:T,containers:Te}=i,q=document.getElementById("submitSpinner");async function we(e){if(!await ve(e))return;i.submitTransactionBtn.disabled=!0;let t="",s={};switch(e){case"IN":{const n=await $("inProductsContainer");if(!n)return;t=`${I.TRANSACTION_BASE_URL}/stock-in`,s={products:n,supplier:document.getElementById("supplier").value,destinationWarehouse:T.destinationWarehouse.value,notes:document.getElementById("inNotes").value};break}case"OUT":{t=`${I.TRANSACTION_BASE_URL}/stock-out`,s={products:await $("outProductsContainer"),customerName:document.getElementById("customerName").value,customerEmail:document.getElementById("customerEmail").value,customerPhone:document.getElementById("customerPhone").value,customerAddress:document.getElementById("customerAddress").value,sourceWarehouse:T.sourceWarehouse.value,notes:document.getElementById("outNotes").value};break}case"TRANSFER":{t=`${I.TRANSACTION_BASE_URL}/transfer`,s={products:await $("transferProductsContainer"),sourceWarehouse:T.sourceWarehouse.value,destinationWarehouse:T.destinationWarehouse.value,notes:document.getElementById("transferNotes").value};break}case"ADJUSTMENT":{t=`${I.TRANSACTION_BASE_URL}/adjustment`,s={products:await $("adjustProductsContainer"),reason:document.getElementById("adjustReason").value,notes:document.getElementById("adjustNotes").value,warehouseId:T.sourceWarehouse.value};break}default:return}try{q.classList.remove("d-none");const n=await w.post(t,s);i.form.reset(),q.classList.add("d-none"),O("success",n.data.message)}catch(n){q.classList.add("d-none"),O("error",n.response.data.message)}finally{i.submitTransactionBtn.disabled=!1,i.typeSelect.onchange=()=>{document.querySelectorAll(`#transactionForm input[type="text"],
       #transactionForm input[type="email"]`).forEach(n=>{n.value=""}),i.buttons.addInProduct.disabled=!0,i.buttons.addOutProduct.disabled=!0,i.buttons.addTransferProduct.disabled=!0,i.addNewProduct.disabled=!0}}}async function $(e){const o=Te[e];if(!o)return[];let t=0,s=0;if(e==="inProductsContainer")try{const r=await w.get(`${I.WAREHOUSE_BASE_URL}/get-warehouse-capacity/${T.destinationWarehouse.value}`);s=r?.data?.data?.totalQuantity??0,t=r.data.data.warehouse.capacity}catch(r){console.error("Failed to fetch warehouse capacity:",r),s=0}const n=[];for(const r of o.querySelectorAll(".product-row")){const m=r.querySelector(".dropdown-toggle"),d=m?m.dataset.value:null,y=r.querySelector(".quantityInput"),l=y?parseInt(y.value||"0",10):0,a=r.querySelector(".limitInput"),h=a?parseInt(a.value||"1",10):1;if(e==="inProductsContainer"){if(l+s>t)return O("error","Can not Stock in Products, exceeded warehouse capacity."),null;s+=l}n.push({productId:d,quantity:l,limit:h})}return n}function O(e,o){V.innerHTML=e==="success"?Y.successToast(o):Y.errorToast(o),setTimeout(()=>{V.innerHTML=""},3e3)}const z=new G,A=()=>({modal:document.getElementById("addProductModalTransaction"),form:document.getElementById("addProductFormTransaction"),closeBtn:document.getElementById("closeProductModalTransaction"),addBtn:document.getElementById("addNewProductBtn"),toastSection:document.getElementById("toastSection")});function Be(){const{addBtn:e,closeBtn:o,form:t,modal:s}=A();e&&e.addEventListener("click",n=>{n.preventDefault(),Se()}),o&&o.addEventListener("click",_),t&&t.addEventListener("submit",Le),window.addEventListener("click",n=>{n.target===s&&_()})}const Se=()=>{const{modal:e}=A();e&&(e.style.display="flex",e.style.visibility="visible")},_=()=>{const{modal:e,form:o}=A();e&&(e.style.display="none",e.style.visibility="hidden"),o&&o.reset()},M=(e,o)=>{const{toastSection:t}=A();t&&(t.innerHTML=e==="success"?z.successToast(o):z.errorToast(o),setTimeout(()=>t.innerHTML="",3e3))},Le=async e=>{e.preventDefault();const{form:o}=A(),t=new FormData,s=await de();t.append("name",document.getElementById("transactionProductName").value),t.append("category",document.getElementById("transactionProductCategory").value),t.append("description",document.getElementById("transactionProductDescription").value),t.append("price",document.getElementById("transactionProductPrice").value),t.append("markup",document.getElementById("transactionProductMarkup").value),t.append("createdBy",s._id);const n=document.getElementById("transactionProductImage");n&&n.files&&[...n.files].forEach(r=>t.append("productImage",r));try{const r=await ce(t);if(!r.data.success)return M("error","Failed to add product");M("success",r.data.message),o&&o.reset(),_(),document.getElementById("transactionType").value==="IN"&&P("IN")}catch(r){console.error(r),M("error",r.response?.data?.message||"Error adding product")}},{buttons:E,containers:se,form:ne,typeSelect:C}=i;C.value="IN";H();ne.addEventListener("reset",()=>{C.value="",Object.values(se).forEach(e=>e.innerHTML=""),E.addInProduct?.setAttribute("disabled",""),E.addOutProduct?.setAttribute("disabled",""),E.addTransferProduct?.setAttribute("disabled",""),i.addNewProduct?.setAttribute("disabled","")});Ee();H();Be();C.addEventListener("change",()=>{Object.values(se).forEach(e=>e.innerHTML=""),H()});E.addInProduct&&E.addInProduct.addEventListener("click",()=>F("inProductsContainer"));E.addOutProduct&&E.addOutProduct.addEventListener("click",()=>F("outProductsContainer"));E.addTransferProduct&&E.addTransferProduct.addEventListener("click",()=>F("transferProductsContainer"));ne.addEventListener("submit",e=>{e.preventDefault();const o=C.value;we(o)});
