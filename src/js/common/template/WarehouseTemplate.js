export default class WarehouseTemplate {
  activeWarehouse = (data) => {
    return `
      <div class="col-md-6 col-xl-4">
        <div class="warehouse-card">

          <div class="warehouse-card-header">
            <h5>${data.name}</h5>
            <span class="status-badge status-active">
              ${data.capacity || 'High'}
            </span>
          </div>

          <p class="warehouse-address">
            <i class="fa-solid fa-location-dot"></i>
            ${data.address}
          </p>

          <div class="warehouse-actions">
            <button
              class="btn btn-light rounded-4"
              onclick="viewWarehouseDetails('${data._id}')"
              data-bs-toggle="modal"
              data-bs-target="#viewWarehouseModal"
            >
              <i class="fa fa-eye"></i> View
            </button>

            <button
              class="btn theme-outline-button rounded-4"
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
