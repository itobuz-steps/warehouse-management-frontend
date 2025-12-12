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
          <td><i class=" me-1 text-primary"></i>${p.name}</td>
          <td class="text-center fw-bold">${p.qty}</td>
        </tr>
      `
      )
      .join('');

    return `
      <div class="summary-section p-3 rounded border mb-4 bg-light">
        <h5 class="fw-bold mb-3 text-primary">
          <i class="fa-solid"></i>Products Summary
        </h5>

        <table class="table table-sm table-bordered">
          <thead class="table-secondary">
            <tr>
              <th style="width:70%">Product</th>
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
        <h6 class="fw-bold mb-2 text-primary">
          <i class="fa-solid fa-circle-info me-2"></i>Stock In Details
        </h6>
        <p><strong>Destination Warehouse:</strong> 
          <span class="badge bg-success">${warehouseName}</span>
        </p>
        <p><strong>Supplier:</strong> ${supplier || '-'}</p>
        <p><strong>Notes:</strong> ${notes || '-'}</p>
      </div>
    `;
  };

  stockOutDetails = (warehouseName, customer, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class="fw-bold mb-2 text-primary">
          <i class="fa-solid fa-circle-info me-2"></i>Stock Out Details
        </h6>
        <p><strong>Source Warehouse:</strong> 
          <span class="badge bg-danger">${warehouseName}</span>
        </p>
        <p><strong>Customer:</strong> ${customer.name || '-'}</p>
        <p><strong>Email:</strong> ${customer.email || '-'}</p>
        <p><strong>Phone:</strong> ${customer.phone || '-'}</p>
        <p><strong>Address:</strong> ${customer.address || '-'}</p>
        <!--<p><strong>Order Number:</strong> ${customer.orderNumber || '-'}</p>-->
        <p><strong>Notes:</strong> ${notes || '-'}</p>
      </div>
    `;
  };

  transferDetails = (source, dest, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class="fw-bold mb-2 text-primary">
          <i class="fa-solid fa-circle-info me-2"></i>Transfer Details
        </h6>
        <p><strong>Source Warehouse:</strong> 
          <span class="badge bg-danger">${source}</span>
        </p>
        <p><strong>Destination Warehouse:</strong> 
          <span class="badge bg-success">${dest}</span>
        </p>
        <p><strong>Notes:</strong> ${notes || '-'}</p>
      </div>
    `;
  };

  adjustmentDetails = (warehouseName, reason, notes) => {
    return `
      <div class="summary-section p-3 rounded border bg-white shadow-sm mb-3">
        <h6 class="fw-bold mb-2 text-primary">
          <i class="fa-solid fa-circle-info me-2"></i>Adjustment Details
        </h6>
        <p><strong>Warehouse:</strong> 
          <span class="badge bg-warning text-dark">${warehouseName}</span>
        </p>
        <p><strong>Reason:</strong> ${reason || '-'}</p>
        <p><strong>Notes:</strong> ${notes || '-'}</p>
      </div>
    `;
  };
}

export default TransactionModalTemplate;
