const addWarehouseDetails = (warehouse) => {
  return `<div class="warehouse-card card mt-3" style="height: auto">
            <div class="card-body mb-0" id="${warehouse._id}">
              <h5 class="card-title warehouse-name mt-0">${warehouse.name}</h5>
              <p class="card-text mt-3 mb-1 warehouse-detail">
                <i class="fa-solid fa-circle-info mx-2"></i>${warehouse.description}
              </p>
              <p class="card-text warehouse-detail">
                <i class="fa-solid fa-location-dot mx-2"></i>${warehouse.address}
              </p>
              <a href="/pages/products.html?warehouseId=${warehouse._id}" class="btn btn-primary warehouse-button">View Products</a>
            </div>
          </div>`;
};

export default addWarehouseDetails;
