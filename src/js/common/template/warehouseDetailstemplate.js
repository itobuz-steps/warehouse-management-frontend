const addWarehouseDetails = (warehouse) => {
  return `<div class="warehouse-card card mt-4">
            <div class="card-body pt-4" id="${warehouse._id}">
              <h5 class="card-title warehouse-name">${warehouse.name}</h5>
              <p class="card-text mt-3 mb-1 warehouse-detail">
                <i class="fa-solid fa-circle-info mx-2"></i>${warehouse.description}
              </p>
              <p class="card-text warehouse-detail">
                <i class="fa-solid fa-location-dot mx-2"></i>${warehouse.address}
              </p>
              <a href="/products.html" class="btn btn-primary warehouse-button">View Products</a>
            </div>
          </div>`;
};

export default addWarehouseDetails;
