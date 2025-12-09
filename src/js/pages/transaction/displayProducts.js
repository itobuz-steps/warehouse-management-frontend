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
  return [...container.querySelectorAll('.dropdown-toggle')]
    .map((btn) => btn.dataset.value)
    .filter((value) => value);
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

  // Dropdown + Quantity
  row.innerHTML = `
    <div class="custom-dropdown">
      <button type="button" class="dropdown-toggle form-control text-start h-46" data-value="">
        <img src="" class="dropdown-thumb d-none" />
        <span>Select Product</span>
      </button>

      <div class="dropdown-menu p-2 border rounded bg-white shadow-sm"
           style="display: none; max-height: 250px; overflow-y: auto;">
        ${availableProducts
          .map((p) => {
            const product = isRawProduct ? p : p.product;
            const img = product.productImage[0] || '';
            return `
              <div class="dropdown-item d-flex align-items-center product-option"
                data-id="${product._id}"
                data-name="${product.name}"
                data-img="${img}"
                data-qty="${isRawProduct ? '' : p.quantity}">
                <img src="${img}" width="32" height="32"
                     class="me-2" style="object-fit:cover;border-radius:4px;">
                <span>${product.name}${isRawProduct ? '' : ` (Quantity: ${p.quantity})`}</span>
              </div>
            `;
          })
          .join('')}
      </div>
    </div>

    <input type="number" min="1" class="form-control quantityInput h-46" placeholder="Quantity"/>
  `;

  // Elements
  const toggleBtn = row.querySelector('.dropdown-toggle');
  const menu = row.querySelector('.dropdown-menu');
  const thumb = row.querySelector('.dropdown-thumb');

  // Toggle dropdown
  toggleBtn.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });

  // Selection logic
  menu.querySelectorAll('.product-option').forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const name = item.dataset.name;
      const img = item.dataset.img || '';
      const qty = item.dataset.qty;

      // Set product ID
      toggleBtn.dataset.value = id;

      if (!isRawProduct) {
        toggleBtn.querySelector('span').textContent = `${name} (Quantity: ${qty})`;
      } else {
        toggleBtn.querySelector('span').textContent = name;
      }

      // Set product image correctly
      if (img.trim() !== '') {
        thumb.src = img;
        thumb.classList.remove('d-none');
      } else {
        thumb.classList.add('d-none');
      }

      // Close menu
      menu.style.display = 'none';

      // Refresh other dropdowns
      updateAllProductDropdowns(container, products, isRawProduct);
    });
  });

  container.appendChild(row);
}

// Update all product dropdowns to reflect current selections
function updateAllProductDropdowns(container, products, isRawProduct) {
  const selectedIds = getSelectedProductIds(container);
  const dropdowns = container.querySelectorAll('.dropdown-toggle');

  dropdowns.forEach((btn) => {
    const currentValue = btn.dataset.value;

    const availableProducts = products.filter((p) => {
      const id = isRawProduct ? p._id : p.product._id;
      return !selectedIds.includes(id) || id === currentValue;
    });

    const menu = btn.parentElement.querySelector('.dropdown-menu');

    // rebuild menu items
    menu.innerHTML = availableProducts
      .map((p) => {
        const product = isRawProduct ? p : p.product;
        const img = product.productImage[0] || '';
        return `
          <div class="dropdown-item d-flex align-items-center product-option"
               data-id="${product._id}"
               data-name="${product.name}"
               data-img="${img}"
               data-qty="${isRawProduct ? '' : p.quantity}">
            <img src="${img}" width="32" height="32"
                 class="me-2" style="object-fit:cover;border-radius:4px;">
            <span>${product.name}${isRawProduct ? '' : ` (Quantity: ${p.quantity})`}</span>
          </div>
        `;
      })
      .join('');

    // rebind click listeners
    menu.querySelectorAll('.product-option').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const name = item.dataset.name;
        const img = item.dataset.img || '';
        const qty = item.dataset.qty;

        btn.dataset.value = id;

        if (!isRawProduct) {
          btn.querySelector('span').textContent = `${name} (Quantity: ${qty})`;
        } else {
          btn.querySelector('span').textContent = name;
        }

        const thumb = btn.querySelector('.dropdown-thumb');

        if (img.trim() !== '') {
          thumb.src = img;
          thumb.classList.remove('d-none');
        } else {
          thumb.classList.add('d-none');
        }

        menu.style.display = 'none';

        updateAllProductDropdowns(container, products, isRawProduct);
      });
    });
  });
}
