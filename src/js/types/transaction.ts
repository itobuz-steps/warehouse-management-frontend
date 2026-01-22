export interface Transaction {
  _id: string;
  type: string;
  product: string;
  quantity: number;
  notes: string;
  performedBy: string;
  shipment?: string | null;
  destinationWarehouse?: string | null;
  sourceWarehouse?: string | null;
  supplier?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: number | null;
  customerAddress?: string | null;
  reason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
