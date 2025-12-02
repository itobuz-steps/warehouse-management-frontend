import api from '../../api/interceptor';
import config from '../../config/config';

export const getCurrentUser = async () => {
  const res = await api.get(`${config.PROFILE_BASE_URL}/me`);
  return res.data.data.user;
};

export const getUserWarehouses = async () => {
  const res = await api.get(
    `${config.WAREHOUSE_BASE_URL}/get-warehouses/`
  );
  return res.data.data;
};