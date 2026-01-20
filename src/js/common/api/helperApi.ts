import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import type { Warehouse } from '../../types/warehouse.js';
import type { User } from '../../types/user.js';
import type { UserResponse, WarehouseListResponse } from './types.js';

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get<UserResponse>(`${config.PROFILE_BASE_URL}/me`);
  return res.data.data.user;
};

export const getUserWarehouses = async (): Promise<Warehouse[]> => {
  const res = await api.get<WarehouseListResponse>(
    `${config.WAREHOUSE_BASE_URL}/get-warehouses/`
  );
  return res.data.data;
};
