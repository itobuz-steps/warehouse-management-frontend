// js/pages/transaction/displayProducts.js
import config from '../../config/config';
import api from '../../api/interceptor';
import { transactionSelectors } from './transactionSelector';

const { containers, warehouses } = transactionSelectors;
const { sourceWarehouse } = warehouses;

// store last loaded products per container
const lastLoadedProductsByContainer = {};

export async function displayProducts(type) {
  let warehouseId = null;
  let containerId;

  switch (type) {
    case 'IN':
      containerId = 'inProductsContainer';
      break;

    case 'OUT':
    case 'TRANSFER':
    case 'ADJUSTMENT':
      warehouseId = sourceWarehouse.value;
      containerId = {
        OUT: 'outProductsContainer',
        TRANSFER: 'transferProductsContainer',
        ADJUSTMENT: 'adjustProductsContainer',
      }[type];
      break;

    default:
      return;
  }

  const container = containers[containerId];
  container.innerHTML = '<em>Loading products...</em>';

  try {
    let products = [];

    if (type === 'IN') {
      const res = await api.get(`${config.PRODUCT_BASE_URL}`);
      products = res.data?.data || [];
    } else {
      if (!warehouseId || warehouseId.trim() === '') {
        container.innerHTML =
          "<p class='text-muted'>Please select a warehouse first.</p>";
        lastLoadedProductsByContainer[containerId] = [];
        return;
      }
      const res = await api.get(
        `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
      );
      products = res.data?.data || [];
    }

    container.innerHTML = '';

    if (!products.length) {
      container.innerHTML = "<p class='text-muted'>No products available.</p>";
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

  const isRawProduct = products.length && !products[0].product;
  // true for Stock IN, false for OUT/TRANSFER/ADJUSTMENT

  row.innerHTML = `
    <select class="form-select productSelect mb-1">
      ${products
        .map((p) => {
          if (isRawProduct) {
            // Stock IN (raw product object)
            return `<option value="${p._id}">${p.name}</option>`;
          } else {
            // Warehouse-specific product
            return `<option value="${p.product._id}">${p.product.name} (Qty: ${p.quantity})</option>`;
          }
        })
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
