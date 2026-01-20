import type { Warehouse } from './warehouse';

type Product = {
  _id: string;
  name: string;
  productImage: string[];
  category: string;
  price: number;
  isArchived: boolean;
  description?: string | null;
  markup?: number | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  warehouseId?: Warehouse;
};

export type { Product };
