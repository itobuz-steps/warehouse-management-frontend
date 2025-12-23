export default class Templates {
  successToast = (msg) => {
    return `  <div class="toast text-bg-success d-flex justify-content-center align-items-center p-2 gap-2" >
    <i class="fa fa-check-circle"></i>
    <p class="m-0">${msg}</p>
  </div>`;
  };

  errorToast = (msg) => {
    return `  <div class="toast text-bg-danger d-flex justify-content-center align-items-center p-2 gap-2">
    <i class="fa fa-times-circle"></i>
    <p class="m-0">${msg}</p>
  </div>`;
  };

  lowStockRow = (item) => {
    return `
    <tr>
      <td>${item.productName}</td>
      <td>${item.quantity} units</td>
      <td>
        <span class="badge">Low</span>
      </td>
    </tr>`;
  };

  noWarehouseMessage = () => {
    return '<p>No warehouse assigned yet! wait for the admin to assign warehouse or contact admin.</p>';
  };

  recentActivityItem = ({ performedBy, actionText, time, dotClass }) => {
    return `
      <div class="activity-item">
        <span class="dot ${dotClass}"></span>
        <div>
          <p><strong>${performedBy}</strong> · ${actionText}</p>
          <small>${time}</small>
        </div>
      </div>`;
  };

  noRecentActivity = () => {
    return '<p class="text-muted">No recent activity</p>';
  };

  warehouseOption = (warehouse, selected = false) => {
    return `<option value="${warehouse._id}" ${selected ? 'selected' : ''}>${warehouse.name}</option>`;
  };

  carouselItem = (product, isActive = false) => {
    const active = isActive ? 'active' : '';
    return `
  <div class="carousel-item ${active}">
    <div class="product-card">
      <div class="product-image-wrapper">
        <img src="${product.productImage}" alt="${product.productName}">
      </div>
      <div class="product-info">
        <div class="product-header">
          <h6>${product.productName}</h6>
          <span class="product-category">${product.category}</span>
        </div>
        <div class="product-stats mb-2">
          <div class="stat-item">
            <div class="stat-label">Price</div>
            <div class="stat-value price">₹${product.price.toLocaleString('hi-IN')}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Sales</div>
            <div class="stat-value sales">₹${product.totalSalesAmount.toLocaleString('hi-IN')}</div>
          </div>
        </div>
    </div>
  </div>
`;
  };
}
