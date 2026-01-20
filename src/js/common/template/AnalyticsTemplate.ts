import type { Warehouse } from '../../types/warehouse';
import type { InventoryProduct } from '../../types/productDetail';

class AnalyticsTemplate {
  warehouseOptions = (warehouse: Warehouse) => {
    return `<option class="dropdown-item warehouse-option" value="${warehouse._id}" id="${warehouse._id}">${warehouse.name}</option>`;
  };

  productOptions = (product: InventoryProduct) => {
    return `<option class="dropdown-item product-option" value="${product.productId}" id="${product.productId}">${product.product.name}</option>`;
  };
}

export default AnalyticsTemplate;
