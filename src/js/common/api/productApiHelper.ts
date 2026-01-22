import type { AxiosResponse } from 'axios';
import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import type {
  LazyLoadedProductListResponse,
  FetchProductsParams,
  QuantityResponse,
  ProductsListResponse,
  ProductResponse,
} from './types.js';

export const addProduct = (
  formData: FormData
): Promise<AxiosResponse<ProductResponse>> => {
  return api.post<ProductResponse>(`${config.PRODUCT_BASE_URL}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const editProduct = (
  formData: FormData,
  productId: string
): Promise<AxiosResponse<ProductResponse>> => {
  return api.put<ProductResponse>(
    `${config.PRODUCT_BASE_URL}/${productId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};

export const deleteProduct = (
  productId: string
): Promise<AxiosResponse<ProductResponse>> => {
  return api.delete<ProductResponse>(`${config.PRODUCT_BASE_URL}/${productId}`);
};

export const updateLimit = (
  quantityId: string,
  limit: number
): Promise<AxiosResponse<QuantityResponse>> => {
  return api.put<QuantityResponse>(
    `${config.QUANTITY_BASE_URL}/${quantityId}/limit`,
    { limit }
  );
};

export const fetchAllProducts = (
  params: FetchProductsParams = {}
): Promise<AxiosResponse<LazyLoadedProductListResponse>> =>
  api.get<LazyLoadedProductListResponse>(config.PRODUCT_BASE_URL, { params });

export const fetchProductsHavingQuantity = (
  params = {}
): Promise<AxiosResponse<LazyLoadedProductListResponse>> =>
  api.get<LazyLoadedProductListResponse>(
    `${config.QUANTITY_BASE_URL}/all-products-having-quantity`,
    {
      params,
    }
  );

export const fetchProductsByWarehouse = (
  warehouseId: string
): Promise<AxiosResponse<ProductsListResponse>> =>
  api.get<ProductsListResponse>(
    `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
  );

export const fetchProductQuantityWarehouse = (
  productId: string,
  warehouseId: string
): Promise<AxiosResponse<QuantityResponse>> =>
  api.get<QuantityResponse>(
    `${config.QUANTITY_BASE_URL}/specific-product-quantity?productId=${productId}&warehouseId=${warehouseId}`
  );

export const fetchTotalProductQuantity = (
  productId: string
): Promise<AxiosResponse<QuantityResponse>> =>
  api.get<QuantityResponse>(
    `${config.QUANTITY_BASE_URL}/product-total-quantity/${productId}`
  );

export const fetchProductSpecificWarehouses = (
  productId: string
): Promise<AxiosResponse<QuantityResponse>> =>
  api.get<QuantityResponse>(
    `${config.QUANTITY_BASE_URL}/product-specific-warehouses/${productId}`
  );

export const qrCodeFetch = (productId: string): Promise<AxiosResponse<Blob>> =>
  api.get<Blob>(`${config.PRODUCT_BASE_URL}/qr/${productId}`, {
    responseType: 'blob',
  });

export const fetchArchivedProducts = (params: FetchProductsParams = {}) => {
  return api.get<LazyLoadedProductListResponse>(
    `${config.PRODUCT_BASE_URL}/archived/all`,
    {
      params,
    }
  );
};

export const restoreProduct = (
  productId: string
): Promise<AxiosResponse<ProductResponse>> =>
  api.patch<ProductResponse>(`${config.PRODUCT_BASE_URL}/${productId}`);
