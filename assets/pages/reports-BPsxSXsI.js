import"../modulepreload-polyfill-B5Qt9EMX.js";import{a as o}from"../interceptor-BqUmgvG5.js";import{g as S,a as w}from"../injectNotificationCanvas-BjfxXw_R.js";import{c as v}from"../config-D1K7ByuX.js";import"../index-C0eOhpfv.js";import"../bootstrap.esm-C02OvDcj.js";class h{stockInDetails=e=>{const i=(e.quantity*e.product.price).toFixed(2),t=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
      <div class="transaction-card" data-id="${e._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper in">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div>
              <div class="transaction-id">${e._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${i}</div>
            <div class="status-badge paid">IN</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${e.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${e.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${e.performedBy.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${t}</span>
            </div>
          </div>
          <button class="expand-btn" onclick="window.toggleDetails(this)">
            Expand Details <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <div class="card-details">
          <div class="details-section">
            <h3 class="section-title">Stock Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Product Name</div>
                <div class="detail-value">${e.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${e.product.category}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${e.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${e.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Supplier Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Supplier</div>
                <div class="detail-value">${e.supplier}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Warehouse</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${e.destinationWarehouse?.name??"N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${e.destinationWarehouse?.address??"N/A"}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${e.notes||"No notes"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${e.performedBy.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `};stockOutDetails=e=>{const i=(e.product.price+e.product.price*(e.product.markup||10)/100).toFixed(2),t=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
      <div class="transaction-card" data-id="${e._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper out">
              <i class="fas fa-arrow-up"></i>
            </div>
            <div>
              <div class="transaction-id">${e._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${i*e.quantity}</div>
            <div class="status-badge ${e.shipment?.toLowerCase()||"pending"}">${e.shipment||"PENDING"}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${e.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${e.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${e.customerName}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${t}</span>
            </div>
          </div>
          <button class="expand-btn" onclick="window.toggleDetails(this)">
            Expand Details <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <div class="card-details">
          <div class="details-section">
            <h3 class="section-title">Stock Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Product Name</div>
                <div class="detail-value">${e.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${e.product.category}</div>
              </div>
               <div class="detail-item">
                <div class="detail-label">Selling Price</div>
                <div class="detail-value">₹${i}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Cost Price</div>
                <div class="detail-value">₹${e.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${e.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Customer Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${e.customerName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Email</div>
                <div class="detail-value">${e.customerEmail}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Phone</div>
                <div class="detail-value">+91 ${e.customerPhone}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${e.customerAddress}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Warehouse</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${e.sourceWarehouse?.name??"N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${e.sourceWarehouse?.address??"N/A"}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${e.notes||"No notes"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${e.performedBy.name}</div>
              </div>
            </div>
          </div>

          <div class="justify-md-between d-flex flex-column flex-md-row gap-2">
            <button class="invoice-btn" value="${e._id}">
              <i class="fa-solid fa-file-arrow-down"></i> Download Invoice
            </button>

            ${!e.shipment||e.shipment.toUpperCase()==="PENDING"?`
            <button class="ship-btn" id="shipBtn" value="${e._id}">
              <i class="fa-solid fa-truck-fast"></i> Ship
            </button>

            <button class="cancel-btn" id="cancelBtn" value="${e._id}">
              <i class="fa-solid fa-ban"></i> Cancel
            </button>
            `:""}
          </div>
        </div>
      </div>
    `};stockAdjustDetails=e=>{const i=(e.quantity*e.product.price).toFixed(2),t=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
      <div class="transaction-card" data-id="${e._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper adjust">
              <i class="fas fa-adjust"></i>
            </div>
            <div>
              <div class="transaction-id">${e._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${i}</div>
            <div class="status-badge pending">ADJUSTMENT</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${e.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${e.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${e.performedBy.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${t}</span>
            </div>
          </div>
          <button class="expand-btn" onclick="window.toggleDetails(this)">
            Expand Details <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <div class="card-details">
          <div class="details-section">
            <h3 class="section-title">Stock Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Product Name</div>
                <div class="detail-value">${e.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${e.product.category}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${e.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${e.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Adjusted Warehouse</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${e.destinationWarehouse?.name??"N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${e.destinationWarehouse?.address??"N/A"}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Reason</div>
                <div class="detail-value">${e.reason||"No reason provided"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${e.notes||"No notes"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${e.performedBy.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `};stockTransferDetails=e=>{const i=(e.quantity*e.product.price).toFixed(2),t=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
      <div class="transaction-card" data-id="${e._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper transfer">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <div>
              <div class="transaction-id">${e._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${i}</div>
            <div class="status-badge paid">TRANSFER</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${e.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${e.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${e.performedBy.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${t}</span>
            </div>
          </div>
          <button class="expand-btn" onclick="window.toggleDetails(this)">
            Expand Details <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <div class="card-details">
          <div class="details-section">
            <h3 class="section-title">Stock Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Product Name</div>
                <div class="detail-value">${e.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${e.product.category}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${e.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${e.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Transferred From</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Warehouse Name</div>
                <div class="detail-value">${e.sourceWarehouse?.name??"N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${e.sourceWarehouse?.address??"N/A"}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Transferred To</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Warehouse Name</div>
                <div class="detail-value">${e.destinationWarehouse?.name??"N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${e.destinationWarehouse?.address??"N/A"}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${e.notes||"No notes"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${e.performedBy.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `};warehouseOptions=e=>`<li><a class="dropdown-item warehouse-option" data-id="${e._id}" id="${e._id}">${e.name}</a></li>`;noStockIndicate=()=>`
      <div class="no-data-message">
        <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
        <h3>No Transactions Found</h3>
        <p>Try adjusting your filters to see more results</p>
      </div>
    `}const c={reportSection:document.querySelector(".transaction-reports"),warehouseDropdown:document.querySelector(".warehouses-options"),dropdownBtn:document.querySelector(".warehouse-dropdown"),dateFilter:document.getElementById("applyDateFilter"),startDate:document.getElementById("startDate"),endDate:document.getElementById("endDate")};let r="ALL",u=1;const A=10;let g=1;window.toggleDetails=function(a){const i=a.closest(".transaction-card").querySelector(".card-details");i.classList.toggle("expanded"),i.classList.contains("expanded")?a.innerHTML='Collapse Details <i class="fas fa-chevron-up"></i>':a.innerHTML='Expand Details <i class="fas fa-chevron-down"></i>'};async function L(){try{const a=await S(),e=await w(),i=new h;N(e,i),I(a,e,i),D(),n("ALL",a,e,i)}catch(a){console.error("Error loading transaction details:",a)}}function D(){const a=document.getElementById("filtersToggleBtn"),e=document.querySelector(".reports-filter");!a||!e||(a.innerHTML=e.classList.contains("show")?'<i class="fas fa-chevron-up"></i>':'<i class="fa fa-filter"></i>',a.addEventListener("click",()=>{e.classList.toggle("show");const i=e.classList.contains("show");a.innerHTML=i?'<i class="fas fa-chevron-up"></i>':'<i class="fa fa-filter"></i>'}))}function N(a,e){const i=document.querySelector(".warehouses-options");i.innerHTML=`
    <li>
      <a class="dropdown-item warehouse-option active" data-id="ALL">All Warehouses</a>
    </li>
  `,a.forEach(t=>{i.innerHTML+=e.warehouseOptions(t)})}function I(a,e,i){B(a,e,i),T(a,e,i),C(a,e,i),q(a,e,i),k()}function k(){document.addEventListener("click",a=>{const e=a.target.closest(".transaction-card");if(e&&!a.target.closest("button")&&!a.target.closest(".invoice-btn")){const i=e.querySelector(".expand-btn");i&&window.toggleDetails(i)}})}function B(a,e,i){document.querySelectorAll(".warehouse-option").forEach(t=>{t.addEventListener("click",()=>{r=t.getAttribute("data-id"),x(t),n(r,a,e,i)})})}function x(a){c.dropdownBtn.textContent=a.textContent.trim(),document.querySelectorAll(".warehouse-option").forEach(t=>{t.classList.remove("active")}),a.classList.add("active"),p();const e=document.querySelector(".reports-filter"),i=document.getElementById("filtersToggleBtn");window.innerWidth<=991&&e&&i&&(e.classList.remove("show"),i.innerHTML='<i class="fa fa-filter"></i>')}function p(){c.startDate.value="",c.endDate.value="",u=1}function T(a,e,i){c.dateFilter.addEventListener("click",()=>{const t=document.querySelector(".warehouse-option.active").getAttribute("data-id");n(t,a,e,i)})}function C(a,e,i){document.querySelectorAll('input[name="btnradio"]').forEach(t=>{t.addEventListener("change",()=>{p(),f(),n(r,a,e,i)})}),f()}function q(a,e,i){document.querySelectorAll('input[name="statusRadio"]').forEach(t=>{t.addEventListener("change",()=>{p(),n(r,a,e,i)})})}function f(){const a=document.querySelector('input[name="btnradio"]:checked').id,e=document.querySelector(".status-filter");a==="Out"?e.style.display="flex":(e.style.display="none",document.getElementById("statusAll").checked=!0)}async function n(a,e,i,t,s=!1){try{let d;const l=F(u);a==="ALL"?d=await o.get(`${v.TRANSACTION_BASE_URL}/${l}`):d=await o.get(`${v.TRANSACTION_BASE_URL}/warehouse-specific-transaction/${a}${l}`);const{transactions:m,counts:$,pagination:E}=d.data.data;s?U(m,t):_(m,t),R($),g=E.totalPages,P()}catch(d){console.error("Error loading transactions:",d)}}function P(){const a=document.getElementById("loadMoreBtn");a.style.display=u<g?"block":"none"}document.getElementById("loadMoreBtn").addEventListener("click",()=>{u++,n(r,null,null,new h,!0)});function U(a,e){!a||a.length===0||(a.forEach(i=>{let t;switch(i.type){case"IN":t=e.stockInDetails(i);break;case"OUT":t=e.stockOutDetails(i);break;case"ADJUSTMENT":t=e.stockAdjustDetails(i);break;case"TRANSFER":t=e.stockTransferDetails(i);break}c.reportSection.innerHTML+=t}),y(),b())}function b(){document.querySelectorAll(".ship-btn").forEach(a=>{a.addEventListener("click",async e=>{const i=e.target.value||e.target.closest(".ship-btn").value;document.getElementById("shipBtn").disabled=!0;try{await o.patch(`${v.NOTIFICATION_BASE_URL}/change-shipment-status/${i}`);const t=document.querySelector(`.transaction-card[data-id="${i}"]`);if(t){const s=t.querySelector(".status-badge");s&&(s.classList.remove("pending"),s.classList.add("shipped"),s.textContent="SHIPPED"),t.querySelectorAll(".ship-btn, .cancel-btn").forEach(l=>l.remove())}}catch(t){console.error("Error shipping transaction:",t)}})}),document.querySelectorAll(".cancel-btn").forEach(a=>{a.addEventListener("click",async e=>{const i=e.target.value||e.target.closest(".cancel-btn").value;document.getElementById("cancelBtn").disabled=!0;try{await o.patch(`${v.NOTIFICATION_BASE_URL}/cancel-shipment/${i}`);const t=document.querySelector(`.transaction-card[data-id="${i}"]`);if(t){const s=t.querySelector(".status-badge");s&&(s.classList.remove("pending"),s.classList.add("cancelled"),s.textContent="CANCELLED"),t.querySelectorAll(".ship-btn, .cancel-btn").forEach(l=>l.remove())}}catch(t){console.error("Error cancelling transaction:",t)}})})}function F(a=1){const e=new URLSearchParams,i=c.startDate.value,t=c.endDate.value;i&&e.append("startDate",i),t&&e.append("endDate",t);const s=document.querySelector('input[name="btnradio"]:checked');let d;s&&(d={All:"ALL",In:"IN",Out:"OUT",Adjust:"ADJUSTMENT",Transfer:"TRANSFER"}[s.id],d&&d!=="ALL"&&e.append("type",d));const l=document.querySelector('input[name="statusRadio"]:checked');return d==="OUT"&&l&&l.id!=="statusAll"&&e.append("status",l.id),e.append("page",a),e.append("limit",A),e.toString()?`?${e.toString()}`:""}function R(a){document.getElementById("count-all").textContent=0,document.getElementById("count-in").textContent=0,document.getElementById("count-out").textContent=0,document.getElementById("count-transfer").textContent=0,document.getElementById("count-adjust").textContent=0,document.getElementById("count-all-status").textContent=0,document.getElementById("count-pending").textContent=0,document.getElementById("count-shipped").textContent=0,document.getElementById("count-cancelled").textContent=0,a.types.forEach(t=>{switch(t._id){case"IN":document.getElementById("count-in").textContent=t.count;break;case"OUT":document.getElementById("count-out").textContent=t.count;break;case"TRANSFER":document.getElementById("count-transfer").textContent=t.count;break;case"ADJUSTMENT":document.getElementById("count-adjust").textContent=t.count;break}});const e=a.types.reduce((t,s)=>t+s.count,0);document.getElementById("count-all").textContent=e,a.status.forEach(t=>{switch(t._id){case"PENDING":document.getElementById("count-pending").textContent=t.count;break;case"SHIPPED":document.getElementById("count-shipped").textContent=t.count;break;case"CANCELLED":document.getElementById("count-cancelled").textContent=t.count;break}});const i=a.status.reduce((t,s)=>t+s.count,0);document.getElementById("count-all-status").textContent=i}function _(a,e){if(c.reportSection.innerHTML="",!a||a.length===0){c.reportSection.innerHTML=e.noStockIndicate();return}a.forEach(i=>{let t;switch(i.type){case"IN":t=e.stockInDetails(i);break;case"OUT":t=e.stockOutDetails(i);break;case"ADJUSTMENT":t=e.stockAdjustDetails(i);break;case"TRANSFER":t=e.stockTransferDetails(i);break}c.reportSection.innerHTML+=t}),y(),b()}function y(){document.querySelectorAll(".invoice-btn").forEach(a=>{a.addEventListener("click",async e=>{try{const i=e.target.value||e.target.closest(".invoice-btn").value,t=await o.get(`${v.TRANSACTION_BASE_URL}/generate-invoice/${i}`,{responseType:"blob"}),s=new Blob([t.data],{type:"application/pdf"}),d=window.URL.createObjectURL(s),l=document.createElement("a");l.href=d,l.download=`invoice-${i}.pdf`,l.click(),window.URL.revokeObjectURL(d)}catch(i){console.error(i)}})})}document.addEventListener("DOMContentLoaded",L);
