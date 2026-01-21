import type { User } from '../../types/user';
import type { Warehouse } from '../../types/warehouse';

type ActiveWarehouseData = Omit<Warehouse, 'managerIds'> & {
  storagePercentage: number | null;
  managerIds: User[];
};

export default class WarehouseTemplate {
  activeWarehouse = (data: ActiveWarehouseData) => {
    const storageLabel = `${data.storagePercentage}%`;
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

          <div class="warehouse-card-header d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2">
                <h5 class="mb-0">${data.name}</h5>

                <span 
                  class="capacity-indicator"
                  style="color:${storageColor};"
                  title="Storage usage"
                >
                  <i class="fa-solid fa-gauge-high"></i>
                  <small class="fw-bold ms-1">${storageLabel}</small>
                </span>
              </div>

              <p class="warehouse-address mb-0">
                <i class="fa-solid fa-location-dot me-1"></i>
                ${data.address}
              </p>
            </div>

            <div class="d-flex align-items-center ms-auto mb-1">
              <button
                class="btn btn-sm btn-outline-soft me-1"
                onclick="editWarehouse('${data._id}')"
                data-bs-toggle="modal"
                data-bs-target="#editWarehouseModal"
                title="Edit"
              >
                <i class="fa fa-edit"></i>
              </button>

              <button
                class="btn btn-sm btn-outline-danger"
                onclick="deleteWarehouse('${data._id}')"
                data-bs-toggle="modal"
                data-bs-target="#deleteWarehouseModal"
                title="Delete"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>

            <p class="text-small text-info-soft mb-3 mt-1">
              <i class="fa-solid fa-circle-info me-1"></i>
              ${data.description || 'No description available'}
            </p>

          <div class="warehouse-managers mb-3">
            <!--<strong>Managers:</strong>-->
           <i class="fa-solid fa-user-group"></i>
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
            class="btn theme-button btn-sm w-100 mt-auto"
          >
            View Products
          </a>

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
