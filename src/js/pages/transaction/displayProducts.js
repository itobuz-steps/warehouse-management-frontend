// js/pages/transaction/displayProducts.js
import config from '../../config/config';
import api from '../../api/interceptor';
import { transactionSelectors } from './transactionSelector';

const { containers, warehouses } = transactionSelectors;
const { sourceWarehouse, destinationWarehouse } = warehouses;

// store last loaded products per container
const lastLoadedProductsByContainer = {};

export async function displayProducts(type) {
  let warehouseId;
  let containerId;

  switch (type) {
    case 'IN':
      warehouseId = destinationWarehouse.value;
      containerId = 'inProductsContainer';
      break;
    case 'OUT':
      warehouseId = sourceWarehouse.value;
      containerId = 'outProductsContainer';
      break;
    case 'TRANSFER':
      warehouseId = sourceWarehouse.value;
      containerId = 'transferProductsContainer';
      break;
    case 'ADJUSTMENT':
      warehouseId = sourceWarehouse.value;
      containerId = 'adjustProductsContainer';
      break;
    default:
      return;
  }

  const container = containers[containerId];
  if (!warehouseId) {
    container.innerHTML =
      "<p class='text-muted'>Please select a warehouse first.</p>";
    lastLoadedProductsByContainer[containerId] = [];
    return;
  }

  try {
    container.innerHTML = '<em>Loading products...</em>';

    const res = await api.get(
      `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
    );
    const products = res.data?.data || [];

    container.innerHTML = '';

    if (!products.length) {
      container.innerHTML =
        "<p class='text-muted'>No products found for this warehouse.</p>";
      lastLoadedProductsByContainer[containerId] = [];
      return;
    }

    lastLoadedProductsByContainer[containerId] = products;
    addProductRow(container, products);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-danger">Failed to load products: ${
      err.response?.data?.message || err.message
    }</p>`;
    lastLoadedProductsByContainer[containerId] = [];
  }
}

export function addProductRowForContainer(containerId) {
  const container = containers[containerId];
  const products = lastLoadedProductsByContainer[containerId];

  if (!container || !products || !products.length) return;

  addProductRow(container, products);
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
    <input
      type="number"
      min="1"
      class="form-control quantityInput"
      placeholder="Quantity"
    />
  `;
  container.appendChild(row);
}
