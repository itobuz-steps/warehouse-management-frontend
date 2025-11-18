const destinationWarehouseSelector = document.getElementById(
  'destinationWarehouse'
);
const stockInSection = document.getElementById('inFields');

export function displayProducts(type) {
  try {
    console.log(destinationWarehouseSelector.value);

    if (type == 'IN') {
      stockInSection.classList.remove('d-none');
    }
  } catch (err) {
    console.log(err.message);
  }
}
