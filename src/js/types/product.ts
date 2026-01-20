type Product = {
  productId: string;
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
};

export type { Product };
