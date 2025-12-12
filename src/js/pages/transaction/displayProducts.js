// js/pages/transaction/displayProducts.js
import config from '../../config/config';
import api from '../../api/interceptor';
import { transactionSelectors } from './transactionSelector';

const { containers, warehouses } = transactionSelectors;
const { sourceWarehouse, destinationWarehouse } = warehouses;

// store last loaded products per container
const lastLoadedProductsByContainer = {};
const existingProductIdsByContainer = {};

export async function displayProducts(type) {
  let warehouseId = null;
  let containerId;

  switch (type) {
    case 'IN':
      containerId = 'inProductsContainer';
      warehouseId = destinationWarehouse.value;
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
    let warehouseProducts = [];

    if (type === 'IN') {
      // Fetch all products
      const allRes = await api.get(`${config.PRODUCT_BASE_URL}`);
      products = allRes.data?.data || [];

      if (warehouseId && warehouseId.trim() !== '') {
        console.log(warehouseId);
        // Fetch warehouse existing products TOO
        const wpRes = await api.get(
          `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
        );
        warehouseProducts = wpRes.data?.data || [];
      }
    } else {
      // Outgoing → ONLY warehouse products
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
      warehouseProducts = products; // same list
    }

    const existingProductIds = new Set(
      warehouseProducts.map((p) => p.product?._id || p._id)
    );
    // console.log(warehouseProducts)
    console.log(existingProductIds);

    container.innerHTML = '';

    if (!products.length) {
      container.innerHTML = "<p class='text-muted'>No products available.</p>";
      lastLoadedProductsByContainer[containerId] = [];
      return;
    }

    lastLoadedProductsByContainer[containerId] = products;
    existingProductIdsByContainer[containerId] = existingProductIds;
    addProductRow(container, products, existingProductIds);
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
  const existingProductIds = existingProductIdsByContainer[containerId];

  if (!container || !products || !products.length) {
    return;
  }

  addProductRow(container, products, existingProductIds);
}

// Helper function to get all currently selected product IDs in a container
function getSelectedProductIds(container) {
  return [...container.querySelectorAll('.dropdown-toggle')]
    .map((btn) => btn.dataset.value)
    .filter((value) => value);
}

function addProductRow(container, products, existingProductIds = new Set()) {
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

    <input type="number" min="1" class="form-control limitInput h-46"  placeholder="Min Limit" style="display:none"/>
  `;

  // Elements
  const toggleBtn = row.querySelector('.dropdown-toggle');
  const menu = row.querySelector('.dropdown-menu');
  const thumb = row.querySelector('.dropdown-thumb');
  const limitInput = row.querySelector('.limitInput');

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
        toggleBtn.querySelector('span').textContent =
          `${name} (Quantity: ${qty})`;
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

      const exists = existingProductIds.has(id);

      // Add/remove limit input dynamically
      if (!exists) {
        limitInput.style.display = 'block';
      } else {
        limitInput.style.display = 'none';
      }

      // Refresh other dropdowns
      updateAllProductDropdowns(
        container,
        products,
        isRawProduct,
        existingProductIds
      );
    });
  });

  container.appendChild(row);
}

// Update all product dropdowns to reflect current selections
function updateAllProductDropdowns(
  container,
  products,
  isRawProduct,
  existingProductIds
) {
  const selectedIds = getSelectedProductIds(container);

  const rows = container.querySelectorAll('.product-row');

  rows.forEach((row) => {
    const btn = row.querySelector('.dropdown-toggle');
    const currentValue = btn.dataset.value;
    const menu = row.querySelector('.dropdown-menu');
    const limitInput = row.querySelector('.limitInput');

    // Compute available products for this row
    const availableProducts = products.filter((p) => {
      const id = isRawProduct ? p._id : p.product._id;
      return !selectedIds.includes(id) || id === currentValue;
    });

    // Rebuild dropdown menu
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
            <img src="${img}" width="32" height="32" class="me-2" style="object-fit:cover;border-radius:4px;">
            <span>${product.name}${isRawProduct ? '' : ` (Quantity: ${p.quantity})`}</span>
          </div>
        `;
      })
      .join('');

    // Rebind selection logic
    menu.querySelectorAll('.product-option').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const name = item.dataset.name;
        const img = item.dataset.img;
        const qty = item.dataset.qty;

        btn.dataset.value = id;
        btn.querySelector('span').textContent = isRawProduct
          ? name
          : `${name} (Quantity: ${qty})`;

        const thumb = btn.querySelector('.dropdown-thumb');

        if (img.trim() !== '') {
          thumb.src = img;
          thumb.classList.remove('d-none');
        } else {
          thumb.classList.add('d-none');
        }

        menu.style.display = 'none';

        //Update limit input dynamically
        const exists = existingProductIds.has(id);
        if (!exists) {
          limitInput.style.display = 'block';
        } else {
          limitInput.style.display = 'none';
        }

        updateAllProductDropdowns(
          container,
          products,
          isRawProduct,
          existingProductIds
        );
      });
    });
  });
}
