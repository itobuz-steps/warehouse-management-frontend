class TransactionModalTemplate {
  productTable = (products) => {
    if (!products.length) {
      return `
        <div class="p-3 rounded border bg-light mb-4">
          <p class="text-muted">No products added.</p>
        </div>
      `;
    }

    const productRows = products
      .map(
        (p) => `
        <tr>
          <td><i class=" me-1 text-secondary"></i>${p.name}</td>
          <td class="text-center">${p.qty}</td>
        </tr>
      `
      )
      .join('');

    return `
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
          <tbody>${productRows}</tbody>
        </table>
      </div>
    `;
  };

  stockInDetails = (warehouseName, supplier, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Stock In Details
        </h6>
        <p class="theme-color">Destination Warehouse: 
          <span class="badge badge-in">${warehouseName}</span>
        </p>
        <p class="theme-color">Supplier: <span>${supplier || '-'}</span></p>
        <p class="theme-color">Notes: <span>${notes || '-'}</span></p>
      </div>
    `;
  };

  stockOutDetails = (warehouseName, customer, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Stock Out Details
        </h6>
        <p class="theme-color">Source Warehouse: 
          <span class="badge badge-out">${warehouseName}</span>
        </p>
        <p class="theme-color">Customer: <span>${customer.name || '-'}</span></p>
        <p class="theme-color">Email: <span>${customer.email || '-'}</span></p>
        <p class="theme-color">Phone: <span>${customer.phone || '-'}</span></p>
        <p class="theme-color">Address: <span>${customer.address || '-'}</span></p>
        <p class="theme-color">Notes: <span>${notes || '-'}</span></p>
      </div>
    `;
  };

  transferDetails = (source, dest, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Transfer Details
        </h6>
        <p class="theme-color">Source Warehouse: 
          <span class="badge badge-transfer">${source}</span>
        </p>
        <p class="theme-color">Destination Warehouse: 
          <span class="badge badge-transfer">${dest}</span>
        </p>
        <p class="theme-color">Notes: <span>${notes || '-'}</span></p>
      </div>
    `;
  };

  adjustmentDetails = (warehouseName, reason, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class=" mb-2 text-secondary">
          <i class="fa-solid fa-circle-info me-2"></i>Adjustment Details
        </h6>
        <p class="theme-color">Warehouse: 
          <span class="badge badge-adjust">${warehouseName}</span>
        </p>
        <p class="theme-color">Reason: <span>${reason || '-'}</span></p>
        <p class="theme-color">Notes: <span>${notes || '-'}</span></p>
      </div>
    `;
  };
}

export default TransactionModalTemplate;
