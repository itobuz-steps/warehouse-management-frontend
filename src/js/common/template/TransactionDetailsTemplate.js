class TransactionDetailsTemplate {
  stockInDetails = (transaction) => {
    const totalPrice = (
      transaction.quantity * transaction.product.price
    ).toFixed(2);
    const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return `
      <div class="transaction-card" data-id="${transaction._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper in">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div>
              <div class="transaction-id">${transaction._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${totalPrice}</div>
            <div class="status-badge paid">IN</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${transaction.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${transaction.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${transaction.performedBy.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${date}</span>
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
                <div class="detail-value">${transaction.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${transaction.product.category}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${transaction.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${transaction.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Supplier Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Supplier</div>
                <div class="detail-value">${transaction.supplier}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Warehouse</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${transaction.destinationWarehouse?.name ?? 'N/A'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${transaction.destinationWarehouse?.address ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${transaction.notes || 'No notes'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${transaction.performedBy.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  stockOutDetails = (transaction) => {
    const totalPrice = (
      transaction.quantity * transaction.product.price
    ).toFixed(2);
    const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return `
      <div class="transaction-card" data-id="${transaction._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper out">
              <i class="fas fa-arrow-up"></i>
            </div>
            <div>
              <div class="transaction-id">${transaction._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${totalPrice}</div>
            <div class="status-badge ${transaction.shipment?.toLowerCase() || 'pending'}">${transaction.shipment || 'PENDING'}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${transaction.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${transaction.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${transaction.customerName}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${date}</span>
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
                <div class="detail-value">${transaction.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${transaction.product.category}</div>
              </div>
               <div class="detail-item">
                <div class="detail-label">Markup</div>
                <div class="detail-value">${transaction.product.markup ?? 10}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${transaction.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${transaction.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Customer Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${transaction.customerName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Email</div>
                <div class="detail-value">${transaction.customerEmail}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Phone</div>
                <div class="detail-value">+91 ${transaction.customerPhone}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${transaction.customerAddress}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Warehouse</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${transaction.sourceWarehouse?.name ?? 'N/A'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${transaction.sourceWarehouse?.address ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${transaction.notes || 'No notes'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${transaction.performedBy.name}</div>
              </div>
            </div>
          </div>

          <div class="justify-md-between d-flex flex-column flex-md-row gap-2">
            <button class="invoice-btn" value="${transaction._id}">
              <i class="fa-solid fa-file-arrow-down"></i> Download Invoice
            </button>

            ${
              !transaction.shipment ||
              transaction.shipment.toUpperCase() === 'PENDING'
                ? `
            <button class="ship-btn" id="shipBtn" value="${transaction._id}">
              <i class="fa-solid fa-truck-fast"></i> Ship
            </button>

            <button class="cancel-btn" id="cancelBtn" value="${transaction._id}">
              <i class="fa-solid fa-ban"></i> Cancel
            </button>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;
  };

  stockAdjustDetails = (transaction) => {
    const totalPrice = (
      transaction.quantity * transaction.product.price
    ).toFixed(2);
    const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return `
      <div class="transaction-card" data-id="${transaction._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper adjust">
              <i class="fas fa-adjust"></i>
            </div>
            <div>
              <div class="transaction-id">${transaction._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${totalPrice}</div>
            <div class="status-badge pending">ADJUSTMENT</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${transaction.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${transaction.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${transaction.performedBy.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${date}</span>
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
                <div class="detail-value">${transaction.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${transaction.product.category}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${transaction.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${transaction.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Adjusted Warehouse</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${transaction.destinationWarehouse?.name ?? 'N/A'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${transaction.destinationWarehouse?.address ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Reason</div>
                <div class="detail-value">${transaction.reason || 'No reason provided'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${transaction.notes || 'No notes'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${transaction.performedBy.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  stockTransferDetails = (transaction) => {
    const totalPrice = (
      transaction.quantity * transaction.product.price
    ).toFixed(2);
    const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return `
      <div class="transaction-card" data-id="${transaction._id}">
        <div class="card-header">
          <div class="transaction-id-section">
            <div class="icon-wrapper transfer">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <div>
              <div class="transaction-id">${transaction._id}</div>
            </div>
          </div>
          <div>
            <div class="transaction-amount">₹${totalPrice}</div>
            <div class="status-badge paid">TRANSFER</div>
          </div>
        </div>
        <div class="card-body">
          <div class="transaction-meta">
            <div class="meta-item">
              <i class="fas fa-box"></i>
              <span>${transaction.product.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-cubes"></i>
              <span>${transaction.quantity} units</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>${transaction.performedBy.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${date}</span>
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
                <div class="detail-value">${transaction.product.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${transaction.product.category}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Price per Unit</div>
                <div class="detail-value">₹${transaction.product.price.toFixed(2)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${transaction.quantity} unit(s)</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Transferred From</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Warehouse Name</div>
                <div class="detail-value">${transaction.sourceWarehouse?.name ?? 'N/A'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${transaction.sourceWarehouse?.address ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Transferred To</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Warehouse Name</div>
                <div class="detail-value">${transaction.destinationWarehouse?.name ?? 'N/A'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Address</div>
                <div class="detail-value">${transaction.destinationWarehouse?.address ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Additional Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${transaction.notes || 'No notes'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By</div>
                <div class="detail-value">${transaction.performedBy.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  warehouseOptions = (warehouse) => {
    return `<li><a class="dropdown-item warehouse-option" data-id="${warehouse._id}" id="${warehouse._id}">${warehouse.name}</a></li>`;
  };

  noStockIndicate = () => {
    return `
      <div class="no-data-message">
        <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
        <h3>No Transactions Found</h3>
        <p>Try adjusting your filters to see more results</p>
      </div>
    `;
  };
}

export default TransactionDetailsTemplate;
