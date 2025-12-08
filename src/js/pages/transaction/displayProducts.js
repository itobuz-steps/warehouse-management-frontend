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

// Helper function to get all currently selected product IDs in a container
function getSelectedProductIds(container) {
  return [...container.querySelectorAll('.productSelect')]
    .map((select) => select.value)
    .filter((value) => value); // Remove empty values
}

function addProductRow(container, products) {
  const row = document.createElement('div');
  row.className = 'product-row mb-2 d-flex flex-column flex-sm-row';

  const isRawProduct = products.length && !products[0].product;
  // true for Stock IN, false for OUT/TRANSFER/ADJUSTMENT

  // Get already selected product IDs to exclude them
  const selectedProductIds = getSelectedProductIds(container);

  // Filter products: remove those already selected
  const availableProducts = products.filter((p) => {
    let productId;
    if (isRawProduct) {
      productId = p._id;
    } else {
      productId = p.product._id;
    }
    return !selectedProductIds.includes(productId);
  });

  // If all products are selected, show warning
  if (!availableProducts.length) {
    row.innerHTML = `<p class="text-warning">All products already selected.</p>`;
    container.appendChild(row);
    return;
  }

  row.innerHTML = `
    <select class="form-select productSelect mb-1">
      <option value=""> Select Product </option>
      ${availableProducts
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

  const productSelect = row.querySelector('.productSelect');

  // Update other dropdowns when this product is changed
  productSelect.addEventListener('change', () => {
    updateAllProductDropdowns(container, products, isRawProduct);
  });

  container.appendChild(row);
}

// Update all product dropdowns to reflect current selections
function updateAllProductDropdowns(container, products, isRawProduct) {
  const selectedProductIds = getSelectedProductIds(container);
  const productSelects = container.querySelectorAll('.productSelect');

  productSelects.forEach((select) => {
    const currentValue = select.value;
    const availableProducts = products.filter((p) => {
      let productId;
      if (isRawProduct) {
        productId = p._id;
      } else {
        productId = p.product._id;
      }
      // Include products that are either not selected OR currently selected in this dropdown
      if (
        !selectedProductIds.includes(productId) ||
        productId === currentValue
      ) {
        return true;
      } else {
        return false;
      }
    });

    // Rebuild the select options
    const options = [
      '<option value=""> Select Product </option>',
      ...availableProducts.map((p) => {
        if (isRawProduct) {
          let selected = '';
          if (p._id === currentValue) {
            selected = 'selected';
          }
          return `<option value="${p._id}" ${selected}>${p.name}</option>`;
        } else {
          let selected = '';
          if (p.product._id === currentValue) {
            selected = 'selected';
          }
          return `<option value="${p.product._id}" ${selected}>${p.product.name} (Qty: ${p.quantity})</option>`;
        }
      }),
    ];

    select.innerHTML = options.join('');
  });
}
