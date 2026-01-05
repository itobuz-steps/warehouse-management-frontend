const addWarehouseDetails = (warehouse, text) => {
  return `
  <div class="warehouse-card card mt-3 h-100 d-flex flex-column">
  <div class="card-body flex-grow-1">
    <h5 class="card-title warehouse-name mb-3">${warehouse.name}</h5>

    <div class="warehouse-detail scrollable-description mb-3">
      <i class="fa-solid fa-circle-info text-muted me-2"></i>
      <span class="description-text">${warehouse.description}</span>
    </div>

    <p class="warehouse-detail mb-2">
      <i class="fa-solid fa-location-dot text-danger me-2"></i>
      <span class="location-text">${warehouse.address}</span>
    </p>

    <div class="warehouse-detail mt-2">
      <span class="me-2">Stock Level:</span>
      <span class="storage p-1 px-2 rounded ${text.toLowerCase()}">
        ${text}
      </span>
    </div>

    <div class="mt-auto pt-3">
      <a
        href="/pages/products.html?warehouseId=${warehouse._id}&filter=warehouses"
        class="btn warehouse-button w-100"
      >
        View Products
      </a>
    </div>
  </div>
</div>`;
};

export default addWarehouseDetails;
