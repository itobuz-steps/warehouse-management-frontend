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

export const addProductQuantity = (productId, warehouseId, quantity, limit) => {
  return api.post(`${config.QUANTITY_BASE_URL}/product-quantity`, {
    productId,
    warehouseId,
    quantity,
    limit,
  });
};

export const fetchAllProducts = () => api.get(config.PRODUCT_BASE_URL);

export const fetchProductsByWarehouse = (id) =>
  api.get(`${config.QUANTITY_BASE_URL}/warehouse-specific-products/${id}`);
