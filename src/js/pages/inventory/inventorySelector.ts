const inventorySelection = {
  toastSection: document.getElementById('toastSection') as HTMLElement,
  addWarehouseForm: document.getElementById(
    'addWarehouseForm'
  ) as HTMLFormElement,
  addWarehouseButton: document.getElementById(
    'addWarehouseBtn'
  ) as HTMLButtonElement,
  deleteWarehouseBtn: document.getElementById(
    'deleteWarehouseBtn'
  ) as HTMLButtonElement,
  deleteWarehouseModal: document.getElementById(
    'deleteWarehouseModal'
  ) as HTMLElement,
  editWarehouseForm: document.getElementById(
    'editWarehouseForm'
  ) as HTMLFormElement,
  editWarehouseModal: document.getElementById(
    'editWarehouseModal'
  ) as HTMLElement,
  editWarehouseName: document.getElementById(
    'editWarehouseName'
  ) as HTMLInputElement,
  editWarehouseAddress: document.getElementById(
    'editWarehouseAddress'
  ) as HTMLInputElement,
  editWarehouseDescription: document.getElementById(
    'editWarehouseDescription'
  ) as HTMLInputElement,
  warehouseCards: document.getElementById('warehouseCards') as HTMLElement,
};

export default inventorySelection;
