import config from '../../config/config';
import api from '../../api/interceptor';
import submitForm from './submitForm';

const stockInSection = document.getElementById('inFields');
const addInProduct = document.getElementById('addInProduct');
const transactionForm = document.getElementById('transactionForm');

export async function stockIn(warehouseId) {
  try {
    const inProductsContainer = document.getElementById('inProductsContainer');
    stockInSection.classList.remove('d-none');

    const res = await api.get(
      `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
    );
    const products = res.data?.data || [];

    inProductsContainer.innerHTML = '';
    if (!products.length) {
      inProductsContainer.innerHTML =
        "<p class='text-muted'>No products found for this warehouse.</p>";
    }

    addProductRow(inProductsContainer, products);

    addInProduct.addEventListener('click', () => {
      addProductRow(inProductsContainer, products);
    });

    transactionForm.addEventListener('click', () => {
      submitForm('IN');
    });
  } catch (err) {
    return err;
  }
}

function addProductRow(container, products) {
  const row = document.createElement('div');
  row.className = 'product-row mb-2';
  row.innerHTML = `
      <select class="form-select productSelect mb-1">
        ${products
          .map(
            (p) =>
              `<option value="${p.product._id}">${p.product.name} (Qty: ${p.quantity})</option>`
          )
          .join('')}
      </select>
      <input type="number" class="form-control quantityInput" placeholder="Quantity" />
    `;
  container.appendChild(row);
}
