import type { Warehouse } from '../../types/warehouse';

type LowStockItem = {
  productName: string;
  quantity: number;
};

type CancelledShipmentItem = {
  productName: string;
  category: string;
  totalCancelledQuantity: number;
};

type AdjustmentProductItem = {
  productName: string;
  category: string;
  totalAdjustedQuantity: number;
  reason: string;
};

type RecentActivityItem = {
  performedBy: string;
  actionText: string;
  time: string;
  dotClass: string;
};

type ProductCarouselItem = {
  productId: string;
  productImage: string;
  productName: string;
  category: string;
  price: number;
  totalSalesAmount: number;
};

type TransactionActionResult = {
  dotClass: string;
  actionText: string;
};

type ITemplates = {
  successToast: (msg: string) => string;
  errorToast: (msg: string) => string;
  lowStockRow: (item: LowStockItem) => string;
  cancelledShipmentRow: (item: CancelledShipmentItem) => string;
  adjustmentProductsRow: (item: AdjustmentProductItem) => string;
  noWarehouseMessage: (user: string) => string;
  recentActivityItem: (item: RecentActivityItem) => string;
  noRecentActivity: () => string;
  warehouseOption: (warehouse: Warehouse, selected?: boolean) => string;
  carouselItem: (
    warehouseId: string,
    product: ProductCarouselItem,
    isActive?: boolean
  ) => string;
  transactionIN: (productName: string, qty: number) => TransactionActionResult;
  transactionOUT: (productName: string, qty: number) => TransactionActionResult;
  transactionTRANSFER: (
    productName: string,
    qty: number,
    targetWarehouse: string
  ) => TransactionActionResult;
  transactionADJUSTMENT: (
    productName: string,
    qty: number
  ) => TransactionActionResult;
  transactionDEFAULT: (
    productName: string,
    qty: number
  ) => TransactionActionResult;
};

export type { ITemplates };
