class TransactionDetailsTemplate {
  stockInDetails = (transaction) => {
    return `<div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="intype accordion-button collapsed transaction-id"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse-${transaction._id}"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                ID - ${transaction._id} <span class="type in">${transaction.type}</span>
              </button>
            </h2>
            <div
              id="flush-collapse-${transaction._id}"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <div class="stock-details">
                  <h3 class="heading">Stock Details</h3>
                  <div class="product-name product-item">
                    Name <span>${transaction.product.name}</span>
                  </div>
                  <div class="product-category product-item">
                    Category <span>${transaction.product.category}</span>
                  </div>
                  <div class="product-price product-item">
                    Price <span>₹${transaction.product.price.toFixed(2)}</span>
                  </div>
                  <div class="product-quantity product-item">
                    Quantity <span>${transaction.quantity} unit(s)</span>
                  </div>
                  <div class="total-price product-item">
                    Total Price <span>₹${(transaction.quantity * transaction.product.price).toFixed(2)}</span>
                  </div>
                </div>
                <hr />
                <div class="supplier-details">
                  <h3 class="heading">Supplier Details</h3>
                  <div class="supplier-name supplier">
                    Supplier: <span>${transaction.supplier}</span>
                  </div>
                </div>
                <hr />
                <div class="supplier-details">
                  <h3 class="heading">Stocked In</h3>
                  <div class="supplier-name supplier">
                    Name: <span>${transaction.destinationWarehouse?.name ?? 'N/A'}</span>
                  </div>
                  <div class="supplier-address supplier">
                    Address: <span>${transaction.destinationWarehouse?.address ?? 'N/A'}</span>
                  </div>
                </div>
                <hr />
                <div class="other-details">
                  <div class="other-date other">
                    Date - <span>${new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}</span>
                  </div>
                  <div class="other-note other">
                    Note - <span>${transaction.notes}</span>
                  </div>
                  <div class="other-manager other">
                    Managed By - <span>${transaction.performedBy.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  };

  stockOutDetails = (transaction) => {
    return `<div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="outtype accordion-button collapsed transaction-id"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse-${transaction._id}"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                ID - ${transaction._id} <span class="type out">${transaction.type}</span>
              </button>
            </h2>
            <div
              id="flush-collapse-${transaction._id}"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <div class="stock-details">
                  <h3 class="heading">Stock Details</h3>
                  <div class="product-name product-item">
                    Name: <span>${transaction.product.name}</span>
                  </div>
                  <div class="product-category product-item">
                    Category: <span>${transaction.product.category}</span>
                  </div>
                  <div class="product-price product-item">
                    Price: <span>₹${transaction.product.price.toFixed(2)}</span>
                  </div>
                  <div class="product-quantity product-item">
                    Quantity: <span>${transaction.quantity} unit(s)</span>
                  </div>
                  <div class="total-price product-item">
                    Total Price: <span>₹${(transaction.quantity * transaction.product.price).toFixed(2)}</span>
                  </div>
                </div>
                <hr />
                <div class="customer-details">
                  <h3 class="heading">Customer Details</h3>
                  <div class="customer-name customer-item">
                    Name: <span>${transaction.customerName}</span>
                  </div>
                  <div class="customer-email customer-item">
                    Email: <span>${transaction.customerEmail}</span>
                  </div>
                  <div class="customer-contact customer-item">
                    Contact: <span>+91 ${transaction.customerPhone}</span>
                  </div>
                  <div class="customer-address customer-item">
                    Address: <span>${transaction.customerAddress}</span>
                  </div>
                </div>
                <hr />
                <div class="supplier-details">
                  <h3 class="heading">Supplied From</h3>
                  <div class="supplier-name supplier">
                    Name: <span>${transaction.sourceWarehouse?.name ?? 'N/A'}</span>
                  </div>
                  <div class="supplier-address supplier">
                    Address: <span>${transaction.sourceWarehouse?.address ?? 'N/A'}</span>
                  </div>
                  <div class="supplier-status supplier">
                    Status: <span class="shipment">${transaction.shipment ?? 'N/A'}</span>
                  </div>
                </div>
                <hr />
                <div class="other-details">
                  <div class="other-date other">
                    Date - <span>${new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}</span>
                  </div>
                  <div class="other-note other">
                    Note - <span>${transaction.notes}</span>
                  </div>
                  <div class="other-manager other">
                    Managed By - <span>${transaction.performedBy.name}</span>
                  </div>
                  <br />
                  <div class="generate-invoice">
                    <button
                      class="invoice-btn"
                      type="button"
                      value="${transaction._id}"
                    >
                      <i class="fa-solid fa-file-arrow-down"></i> Generate
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  };

  stockAdjustDetails = (transaction) => {
    return `<div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="adjusttype accordion-button collapsed transaction-id"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse-${transaction._id}"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                ID - ${transaction._id} <span class="type adjust">${transaction.type}</span>
              </button>
            </h2>
            <div
              id="flush-collapse-${transaction._id}"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <div class="stock-details">
                  <h3 class="heading">Stock Details</h3>
                  <div class="product-name product-item">
                    Name: <span>${transaction.product.name}</span>
                  </div>
                  <div class="product-category product-item">
                    Category: <span>${transaction.product.category}</span>
                  </div>
                  <div class="product-price product-item">
                    Price: <span>₹${transaction.product.price.toFixed(2)}</span>
                  </div>
                  <div class="product-quantity product-item">
                    Quantity: <span>${transaction.quantity} unit(s)</span>
                  </div>
                  <div class="total-price product-item">
                    Total Price: <span>₹${(transaction.quantity * transaction.product.price).toFixed(2)}</span>
                  </div>
                </div>

                <hr />
                <div class="supplier-details">
                  <h3 class="heading">Adjusted Warehouse</h3>
                  <div class="supplier-name supplier">
                    Name: <span>${transaction.destinationWarehouse?.name ?? 'N/A'}</span>
                  </div>
                  <div class="supplier-name supplier">
                    Address: <span>${transaction.destinationWarehouse?.address ?? 'N/A'}</span>
                  </div>
                </div>
                <hr />
                <div class="other-details">
                  <div class="other-date other">
                    Date - <span>${new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}</span>
                  </div>
                  <div class="other-note other">
                    Note - <span>${transaction.notes}</span>
                  </div>
                  <div class="other-note other">
                    Reason - <span>${transaction.reason}</span>
                  </div>
                  <div class="other-manager other">
                    Managed By - <span>${transaction.performedBy.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  };

  stockTransferDetails = (transaction) => {
    return `<div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="transfertype accordion-button collapsed transaction-id"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse-${transaction._id}"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                ID - ${transaction._id} <span class="type transfer">${transaction.type}</span>
              </button>
            </h2>
            <div
              id="flush-collapse-${transaction._id}"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <div class="stock-details">
                  <h3 class="heading">Stock Details</h3>
                  <div class="product-name product-item">
                    Name: <span>${transaction.product.name}</span>
                  </div>
                  <div class="product-category product-item">
                    Category: <span>${transaction.product.category}</span>
                  </div>
                  <div class="product-price product-item">
                    Price: <span>₹${transaction.product.price.toFixed(2)}</span>
                  </div>
                  <div class="product-quantity product-item">
                    Quantity: <span>${transaction.quantity} unit(s)</span>
                  </div>
                  <div class="total-price product-item">
                    Total Price: <span>₹${(transaction.quantity * transaction.product.price).toFixed(2)}</span>
                  </div>
                </div>

                <hr />
                <div class="supplier-details">
                  <h3 class="heading">Transferred From</h3>
                  <div class="supplier-name supplier">
                    Name: <span>${transaction.sourceWarehouse?.name ?? 'N/A'}</span>
                  </div>
                  <div class="supplier-name supplier">
                    Address: <span>${transaction.sourceWarehouse?.address ?? 'N/A'}</span>
                  </div>
                </div>
                <hr />
                <div class="supplier-details">
                  <h3 class="heading">Transferred To</h3>
                  <div class="supplier-name supplier">
                    Name: <span>${transaction.destinationWarehouse?.name ?? 'N/A'}</span>
                  </div>
                  <div class="supplier-name supplier">
                    Address: <span>${transaction.destinationWarehouse?.address ?? 'N/A'}</span>
                  </div>
                </div>

                <hr />

                <div class="other-details">
                  <div class="other-date other">
                    Date - <span>${new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}</span>
                  </div>
                  <div class="other-note other">
                    Note - <span>${transaction.notes}</span>
                  </div>
                  <div class="other-manager other">
                    Managed By - <span>${transaction.performedBy.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  };

  warehouseOptions = (warehouse) => {
    return `<li><a class="dropdown-item warehouse-option" data-id="${warehouse._id}" id="${warehouse._id}">${warehouse.name}</a></li>`;
  };

  noStockIndicate = () => {
    return `<div class="no-data-message">
              No Data Found
            </div>`;
  };
}

export default TransactionDetailsTemplate;
