import { stockIn } from './stockInManagement';

const destinationWarehouseSelector = document.getElementById(
  'destinationWarehouse'
);

export async function displayProducts(type) {
  try {
    const warehouseId = destinationWarehouseSelector.value;

    if (type == 'IN') {
      await stockIn(warehouseId);
    }
  } catch (err) {
    console.log(err.message);
  }
}
