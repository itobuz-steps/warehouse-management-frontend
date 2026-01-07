export function productRowTemplate(availableProducts, isRawProduct) {
  return `
    <div class="custom-dropdown">
      <button type="button"
              class="dropdown-toggle form-control text-start h-46"
              data-value="">
        <img src="" class="dropdown-thumb d-none" />
        <span>Select Product</span>
      </button>

      <div class="dropdown-menu p-2 border rounded bg-white shadow-sm"
           style="display:none; max-height:250px; overflow-y:auto;">
        ${availableProducts
          .map((p) => {
            const product = isRawProduct ? p : p.product;
            const img = product.productImage?.[0] || '';

            return `
            <div class="dropdown-item d-flex align-items-center product-option"
                 data-id="${product._id}"
                 data-name="${product.name}"
                 data-img="${img}"
                 data-qty="${isRawProduct ? '' : p.quantity}">
              <img src="${img}"
                   width="32"
                   height="32"
                   class="me-2"
                   style="object-fit:cover;border-radius:4px;">
              <span>
                ${product.name}${isRawProduct ? '' : ` (Quantity: ${p.quantity})`}
              </span>
            </div>
          `;
          })
          .join('')}
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
  `;
}

export function productOptionsTemplate(products, isRawProduct) {
  return products
    .map((p) => {
      const product = isRawProduct ? p : p.product;
      const img = product.productImage?.[0] || '';

      return `
      <div class="dropdown-item d-flex align-items-center product-option"
           data-id="${product._id}"
           data-name="${product.name}"
           data-img="${img}"
           data-qty="${isRawProduct ? '' : p.quantity}">
        <img src="${img}"
             width="32"
             height="32"
             class="me-2"
             style="object-fit:cover;border-radius:4px;">
        <span>
          ${product.name}${isRawProduct ? '' : ` (Quantity: ${p.quantity})`}
        </span>
      </div>
    `;
    })
    .join('');
}
