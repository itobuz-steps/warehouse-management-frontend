class AnalyticsTemplate {
  warehouseOptions = (warehouse) => {
    return `<option class="dropdown-item warehouse-option" value="${warehouse._id}" id="${warehouse._id}">${warehouse.name}</option>`;
  };

  productOptions = (product) => {
    return `<option class="dropdown-item product-option" value="${product.productId}" id="${product.productId}">${product.product.name}</option>`;
  };
}

export default AnalyticsTemplate;
