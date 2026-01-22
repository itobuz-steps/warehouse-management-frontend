export type ProductDetails = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  markup: number;
  isArchived: boolean;
  productImage: string[];

  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type InventoryProduct = {
  _id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  limit: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  product: ProductDetails;
};
