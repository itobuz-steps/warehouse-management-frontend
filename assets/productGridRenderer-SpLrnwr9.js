import{T as p}from"./index-C0eOhpfv.js";import{p as s}from"./imageCarousel-Dy8HoRmN.js";const l=new p,f=(t,a)=>{s.toastSection.innerHTML=t==="success"?l.successToast(a):l.errorToast(a),setTimeout(()=>s.toastSection.innerHTML="",3e3)},w=()=>{s.searchInput.value="",s.categoryFilter.value="",s.sortSelect.value=""},v=t=>{s.warehouseSelect.disabled=t!=="warehouses",Array.from(s.sortSelect.options).forEach(a=>{(a.value==="quantity_asc"||a.value==="quantity_desc")&&(a.style.display=t==="warehouses"?"block":"none")})},h=(t="No products found.")=>{s.productGrid.className="empty",s.productGrid.innerHTML=`<div>${t}</div>`,s.pagination.innerHTML=""},b=()=>{s.productGrid.className="error",s.productGrid.innerHTML="<div>Failed to load products. Please try again.</div>",s.pagination.innerHTML=""},g=()=>{s.addProductModal.style.display="flex"},$=()=>{s.addProductModal.style.display="none"},L=()=>{const t=new URL(window.location);t.searchParams.delete("productId"),window.history.replaceState({},"",t)},q=(t,a,i=!1)=>{i||(a.innerHTML=""),t.forEach(r=>{const e=document.createElement("option");e.value=r._id,e.textContent=r.name,a.appendChild(e)})};function T(t){return`
    <div class="card-image-wrapper">
      <img src="${t.productImage?.[0]??"/images/placeholder.png"}" alt="${t.name}" />
      <span class="category-badge">${t.category??"Uncategorized"}</span>
    </div>
    <hr>
    <div class="card-body">
      <h5 class="mb-0">${t.name}</h5>

      <div class="info-row">
        <span class="price">₹${t.price??"N/A"}</span>
        <!--<span class="category">${t.category??"Not Categorized"}</span>-->
        <span class="markup">Markup: ${t.markup??"10"}% <i class="fa-solid fa-arrow-trend-up"></i></span>
      </div>
      <div class="d-flex justify-content-center mt-auto">
        <button 
        class="btn theme-button w-100" 
        id="viewDetails"
        type="button"
        data-product='${JSON.stringify(t)}'
      >
        View Details <i class="fa-solid fa-arrow-right-to-bracket"></i>
      </button>
      </div>
    </div>
  `}function S(t){const a=t.quantity<=t.limit;return`
    <div class="manager-qty-card ${a?"low":""}">
      <div class="qty-row">
        <span class="qty-text">
          Quantity: <strong>${t.quantity}</strong>
          <span class="qty-limit">(Limit: ${t.limit})</span>
        </span>

        ${a?'<i class="fa-solid fa-arrow-trend-down low-stock-icon"></i>':""}
      </div>

      <button
        class="btn btn-outline-soft btn-sm edit-limit-btn w-100"
        data-id="${t._id}"
        data-limit="${t.limit}"
      >
        <i class="fa-regular fa-pen-to-square"></i>
        Edit Limit
      </button>
    </div>
  `}function E(t){return t.map(a=>`
        <div class="manager-qty-card ${a.quantity<=a.limit?"low":""}">
          <div class="qty-row">
            <span class="qty-text">
              <strong>${a.warehouseId?.name}: </strong>${a.quantity}
            </span>
            <div class="qty-limit-row">
              ${a.quantity<=a.limit?'<i class="fa-solid fa-arrow-trend-down low-stock-icon"></i>':""}
            </div>
          </div>

          <!-- Edit Limit Button -->
          <button 
            class="btn btn-outline-soft btn-sm edit-limit-btn w-100"
            data-id="${a._id}"
            data-limit="${a.limit}">
            <i class="fa-regular fa-pen-to-square"></i> Edit Limit
          </button>
        </div>
      `).join("")}const M=({container:t,currentPage:a,totalPages:i,onPageChange:r})=>{if(t.innerHTML="",i<=1){t.style.display="none";return}t.style.display="flex";const e=(o,c,m=!1)=>{const d=document.createElement("button");return d.textContent=o,d.className="page-btn",m?(d.disabled=!0,d.classList.add("disabled"),d):(d.addEventListener("click",()=>{r(c),window.scrollTo({top:0,behavior:"smooth"})}),d)};t.appendChild(e("<<",1,a===1)),t.appendChild(e("<",a-1,a===1));const n=document.createElement("span");n.className="page-info",n.textContent=`${a} of ${i}`,t.appendChild(n),t.appendChild(e(">",a+1,a===i)),t.appendChild(e(">>",i,a===i))},C=({container:t,products:a,createCardHTML:i,onViewDetails:r,emptyState:e})=>{if(t.innerHTML="",!a.length){e();return}a.forEach(n=>{const o=document.createElement("div");o.className="product-card",o.dataset.product=JSON.stringify(n),o.innerHTML=i(n),o.addEventListener("click",()=>{r(n)}),t.appendChild(o)}),t.querySelectorAll("#viewDetails").forEach(n=>{n.addEventListener("click",o=>{r(JSON.parse(o.currentTarget.dataset.product))})})};export{f as a,b,C as c,M as d,T as e,w as f,$ as g,S as m,g as o,q as p,L as r,h as s,v as u,E as w};
