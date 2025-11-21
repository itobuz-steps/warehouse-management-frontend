import api from '../../api/interceptor';
import config from '../../config/config';

export const getCurrentUser = async () => {
  const res = await api.get(`${config.PROFILE_BASE_URL}/me`);
  return res.data.data.user;
};

export const getUserWarehouses = async (userId) => {
  const res = await api.get(
    `${config.WAREHOUSE_BASE_URL}/get-warehouses/${userId}`
  );
  return res.data.data;
};

export const addProduct = (formData) => {
  return api.post(`${config.PRODUCT_BASE_URL}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const editProduct = (formData, productId) => {
  return api.put(`${config.PRODUCT_BASE_URL}/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProduct = (productId) => {
  return api.delete(`${config.PRODUCT_BASE_URL}/${productId}`);
};

export const addProductQuantity = (productId, warehouseId, quantity, limit) => {
  return api.post(`${config.QUANTITY_BASE_URL}/product-quantity`, {
    productId,
    warehouseId,
    quantity,
    limit,
  });
};

export const fetchAllProducts = () => api.get(config.PRODUCT_BASE_URL);

export const fetchProductsWithQuantity = () =>
  api.get(`${config.QUANTITY_BASE_URL}/all-products-quantity`);

export const fetchProductsByWarehouse = (warehouseId) =>
  api.get(
    `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
  );

export const fetchProductQuantityWarehouse = (productId, warehouseId) =>
  api.get(
    `${config.QUANTITY_BASE_URL}/specific-product-quantity?productId=${productId}&warehouseId=${warehouseId}`
  );

export const fetchTotalProductQuantity = (productId) =>
  api.get(`${config.QUANTITY_BASE_URL}/product-total-quantity/${productId}`);

export const fetchProductSpecificWarehouses = (productId) =>
  api.get(
    `${config.QUANTITY_BASE_URL}/product-specific-warehouses/${productId}`
  );
