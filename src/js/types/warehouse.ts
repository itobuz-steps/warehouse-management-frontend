type Warehouse = {
  _id: string;
  name: string;
  address: string;
  managerIds: string[];
  active: boolean;
  capacity: number;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type { Warehouse };
