export default class WarehouseTemplate {
  activeWarehouse = (data) => {
    let storageLabel = `${data.storagePercentage}%`;
    let storageColor = '#6c757d';

    if (data.storagePercentage !== null) {
      
      if (data.storagePercentage < 50) {
        // storageLabel = 'HIGH';
        storageColor = 'green';
      } else if (data.storagePercentage <= 80) {
        // storageLabel = 'MODERATE';
        storageColor = 'orange';
      } else {
        // storageLabel = 'LOW';
        storageColor = 'red';
      }

    }

    return `
      <div class="col-md-6 col-xl-4">
        <div class="warehouse-card">

          <div class="warehouse-card-header">
            <h5>${data.name}</h5>
            <span 
              class="status-badge bg-light"
              style="color:${storageColor};"
            >
              ${storageLabel}
            </span>
          </div>

          <p class="warehouse-address">
            <i class="fa-solid fa-location-dot"></i>
            ${data.address}
          </p>

          <p class="text-muted">
            <i class="fa-solid fa-circle-info"></i>
            ${data.description || 'No description available'}
          </p>

          <div class="warehouse-managers mb-2">
            <strong>Managers:</strong>
            ${
              data.managerIds?.length
                ? data.managerIds
                    .map((m) => `<span class="manager-badge">${m.name}</span>`)
                    .join('')
                : '<span class="text-muted">None</span>'
            }
          </div>

          <a 
            href="/pages/products.html?warehouseId=${data._id}&filter=warehouses"
            class="btn btn-sm btn-outline-soft mb-3"
          >
            View Products
          </a>

          <div class="warehouse-actions">
            <button
              class="theme-button rounded-4"
              onclick="editWarehouse('${data._id}')"
              data-bs-toggle="modal"
              data-bs-target="#editWarehouseModal"
            >
              <i class="fa fa-edit"></i> Edit
            </button>

            <button
              class="btn btn-danger rounded-4"
              onclick="deleteWarehouse('${data._id}')"
              data-bs-toggle="modal"
              data-bs-target="#deleteWarehouseModal"
            >
              <i class="fa fa-trash"></i> Delete
            </button>
          </div>

        </div>
      </div>
    `;
  };

  emptyWarehouse = () => {
    return `
      <div class="col-12">
        <div class="empty-state text-center p-5">
          <i class="fa fa-archive fs-1 mb-3 text-muted"></i>
          <h5>No Warehouses Found</h5>
          <p class="text-muted">Start by adding a new warehouse</p>
        </div>
      </div>
    `;
  };
}
