declare global {
  interface Window {
    sendInviteAgain: (email: string) => Promise<void>;
    changeStatus: (managerId: string) => Promise<void>;
    deleteWarehouse: (id: string) => void;
    editWarehouse: (warehouseId: string) => Promise<void>;
  }
}
