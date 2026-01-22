import type { Product } from '../../types/product';
import type { Transaction } from '../../types/transaction';
import type { User } from '../../types/user';
import type { Warehouse } from '../../types/warehouse';

type ITransactionModalTemplate = {
  productTable: (products: { name: string; qty: number }[]) => string;
  stockInDetails: (
    warehouseName: string,
    supplier: string,
    notes: string
  ) => string;
  stockOutDetails: (
    warehouseName: string,
    customer: { name: string; email: string; phone: string; address: string },
    notes: string
  ) => string;
  transferDetails: (source: string, dest: string, notes: string) => string;
  adjustmentDetails: (
    warehouseName: string,
    reason: string,
    notes: string
  ) => string;
};

type TransactionPopulated = Transaction & {
  product: Product;
  performedBy: User;
  destinationWarehouse?: Warehouse;
  sourceWarehouse?: Warehouse;
};

export type { ITransactionModalTemplate, TransactionPopulated };
