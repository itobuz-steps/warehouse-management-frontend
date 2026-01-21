import type { Warehouse } from '../types/warehouse';
import type { ITemplates } from './types/ITemplate';

export class Templates implements ITemplates {
  successToast = (msg: string) => {
    return `  <div class="toast text-bg-success d-flex justify-content-center align-items-center p-2 gap-2" >
    <i class="fa fa-check-circle"></i>
    <p class="m-0">${msg}</p>
  </div>`;
  };

  errorToast = (msg: string) => {
    return `  <div class="toast text-bg-danger d-flex justify-content-center align-items-center p-2 gap-2">
    <i class="fa fa-times-circle"></i>
    <p class="m-0">${msg}</p>
  </div>`;
  };

  lowStockRow = (item: { productName: string; quantity: number }) => {
    return `
    <tr>
      <td>${item.productName}</td>
      <td>${item.quantity} units</td>
      <td>
        <span class="badge">Low</span>
      </td>
    </tr>`;
  };

  cancelledShipmentRow = (item: {
    productName: string;
    category: string;
    totalCancelledQuantity: number;
  }) => {
    return `
    <tr>
      <td>${item.productName}</td>
      <td>${item.category}</td>
      <td>
        <span class="badge bg-danger-subtle text-black">${item.totalCancelledQuantity}</span>
      </td>
    </tr>`;
  };

  adjustmentProductsRow = (item: {
    productName: string;
    category: string;
    totalAdjustedQuantity: number;
    reason: string;
  }) => {
    return `
    <tr>
      <td>${item.productName}</td>
      <td>${item.category}</td>
      <td>
        <span class="badge bg-warning-subtle text-black">${item.totalAdjustedQuantity}</span>
      </td>
      <td>${item.reason}</td>
    </tr>`;
  };

  noWarehouseMessage = (user: string) => {
    if (user === 'admin') {
      return `
            <p><i class="fas fa-warehouse"></i> No warehouse assigned yet! 
            <a
              class="add-manager-btn text-success"
              data-bs-toggle="modal"
              data-bs-target="#addManagerModal"
              title="Add Manager"
            >
                <i class="fa-solid fa-user-plus"></i> Add Manager
            </a>
            or 
            <a href="/pages/inventory.html" class="text-info">Assign Warehouse</a> </p>`;
    } else {
      return `
            <p><i class="fas fa-warehouse"></i> No warehouse assigned yet! 
            Wait for the admin to assign a warehouse or contact the admin.</p>`;
    }
  };

  recentActivityItem = ({
    performedBy,
    actionText,
    time,
    dotClass,
  }: {
    performedBy: string;
    actionText: string;
    time: string;
    dotClass: string;
  }) => {
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

  warehouseOption = (warehouse: Warehouse, selected: boolean = false) => {
    return `<option value="${warehouse._id}" ${selected ? 'selected' : ''}>${warehouse.name}</option>`;
  };

  carouselItem = (
    warehouseId: string,
    product: {
      productId: string;
      productImage: string;
      productName: string;
      category: string;
      price: number;
      totalSalesAmount: number;
    },
    isActive: boolean = false
  ) => {
    const active = isActive ? 'active' : '';
    return `
  <div class="carousel-item ${active}">
    <a
      href="/pages/products.html?filter=warehouses&warehouseId=${warehouseId}&productId=${product.productId}"
      class="text-decoration-none text-dark"
    >
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
    </a>
  </div>
`;
  };

  transactionIN = (productName: string, qty: number) => {
    return {
      dotClass: 'success',
      actionText: `Stock In of <strong>${productName}</strong> (${qty} units)`,
    };
  };

  transactionOUT = (productName: string, qty: number) => {
    return {
      dotClass: 'info',
      actionText: `Stock Out of <strong>${productName}</strong> (${qty} units)`,
    };
  };

  transactionTRANSFER = (
    productName: string,
    qty: number,
    targetWarehouse: string
  ) => {
    return {
      dotClass: 'warning',
      actionText: `Transfer <strong>${productName}</strong> (${qty} units) to ${targetWarehouse}`,
    };
  };

  transactionADJUSTMENT = (productName: string, qty: number) => {
    return {
      dotClass: 'danger',
      actionText: `Adjustment made on <strong>${productName}</strong> (${qty} units)`,
    };
  };

  transactionDEFAULT = (productName: string, qty: number) => {
    return {
      dotClass: 'info',
      actionText: `<strong>${productName}</strong> (${qty} units)`,
    };
  };
}
