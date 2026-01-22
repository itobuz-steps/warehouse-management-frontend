export type Notification = {
  seen: boolean;
  title: string;
  isShipped: boolean;
  isCancelled: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  transactionId: string;
  reportedByName: string;
  message: string;
  performedByName: string;
  performedByImage: string;
};
