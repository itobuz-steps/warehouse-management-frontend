import type { User } from '../../types/user.js';
import type { Warehouse } from '../../types/warehouse.js';
import type { Product } from '../../types/product.js';
import type { Quantity } from '../../types/quantity.js';

type UserResponse = {
  data: {
    user: User;
  };
  success: boolean;
  message: string;
};

type ProductResponse = {
  data: Product;
  success: boolean;
  message: string;
};

type LazyLoadedProductListResponse = {
  data: {
    products: Product[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    productsPerPage: number;
  };
  success: boolean;
  message: string;
};

type FetchProductsParams = {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

type QuantityResponse = {
  data: (Product & Quantity)[];
  success: boolean;
  message: string;
};

type ProductsListResponse = {
  data: Product[];
  success: boolean;
  message: string;
};

type WarehouseListResponse = {
  data: Warehouse[];
  success: boolean;
  message: string;
};

export type {
  UserResponse,
  ProductResponse,
  LazyLoadedProductListResponse,
  FetchProductsParams,
  QuantityResponse,
  ProductsListResponse,
  WarehouseListResponse,
};
