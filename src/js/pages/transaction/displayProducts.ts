// js/pages/transaction/displayProducts.js
import { config } from '../../config/config.js';
import api from '../../api/interceptor.js';
import { transactionSelectors } from './transactionSelector.js';
import {
  productOptionsTemplate,
  productRowTemplate,
} from '../../common/template/transactionDropdown.js';
import type { InventoryProduct } from '../../types/productDetail.js';
import { AxiosError } from 'axios';

const { containers, warehouses } = transactionSelectors;
const { sourceWarehouse, destinationWarehouse } = warehouses;

// store last loaded products per container
const lastLoadedProductsByContainer: Record<string, InventoryProduct[]> = {};
const existingProductIdsByContainer: Record<string, Set<string>> = {};

export async function displayProducts(type: string) {
  let warehouseId = null;
  let containerId;

  switch (type) {
    case 'IN':
      containerId = 'inProductsContainer';
      warehouseId = destinationWarehouse?.value;
      break;

    case 'OUT':
    case 'TRANSFER':
    case 'ADJUSTMENT':
      warehouseId = sourceWarehouse?.value;
      containerId = {
        OUT: 'outProductsContainer',
        TRANSFER: 'transferProductsContainer',
        ADJUSTMENT: 'adjustProductsContainer',
      }[type];
      break;

    default:
      return;
  }

  const container = containers[
    containerId as keyof typeof containers
  ] as HTMLElement;
  container.innerHTML = '<em>Loading products...</em>';

  try {
    let products: InventoryProduct[] = [];
    let warehouseProducts: InventoryProduct[] = [];

    if (type === 'IN') {
      // Fetch all products
      const allRes = await api.get(`${config.PRODUCT_BASE_URL}`);
      products = allRes.data?.data.products || [];

      if (warehouseId && warehouseId.trim() !== '') {
        // Fetch warehouse existing products TOO
        const wpRes = await api.get(
          `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
        );
        warehouseProducts = wpRes.data?.data || [];
      }
    } else {
      if (!warehouseId || warehouseId.trim() === '') {
        container.innerHTML =
          "<p class='text-muted'>Please select a warehouse first.</p>";
        lastLoadedProductsByContainer[containerId] = [];
        return;
      }

      const sourceRes = await api.get(
        `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
      );
      products = sourceRes.data?.data || [];
      warehouseProducts = products;

      if (type === 'TRANSFER' && destinationWarehouse?.value) {
        const destRes = await api.get(
          `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${destinationWarehouse.value}`
        );
        warehouseProducts = destRes.data?.data || [];
      }
    }

    const existingProductIds = new Set(
      warehouseProducts.map(
        (product: InventoryProduct) => product.product?._id || product._id
      )
    );

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
    if (err instanceof AxiosError && err.response) {
      console.error(err);
      container.innerHTML = `<p class="text-danger">Failed to load products: ${
        err.response?.data?.message || err.message
      }</p>`;
      lastLoadedProductsByContainer[containerId] = [];
    }
  }
}

export function addProductRowForContainer(containerId: string) {
  const container = containers[containerId as keyof typeof containers];
  const products = lastLoadedProductsByContainer[containerId];
  const existingProductIds = existingProductIdsByContainer[containerId];

  if (!container || !products || !products.length) {
    return;
  }

  addProductRow(container, products, existingProductIds);
}

// Helper function to get all currently selected product IDs in a container
function getSelectedProductIds(container: HTMLElement) {
  console.log('container', container);
  return [
    ...(container.querySelectorAll(
      '.dropdown-toggle'
    ) as NodeListOf<HTMLButtonElement>),
  ]
    .map((btn: HTMLButtonElement) => btn.dataset.value)
    .filter((value) => value);
}

function addProductRow(
  container: HTMLElement,
  products: InventoryProduct[],
  existingProductIds: Set<string> = new Set()
) {
  const row = document.createElement('div');
  row.className = 'product-row mb-2 d-flex flex-column flex-sm-row';

  const isRawProduct = products.length && !products[0].product;
  // true for Stock IN, false for OUT/TRANSFER/ADJUSTMENT

  // Get already selected product IDs to exclude them
  const selectedProductIds = getSelectedProductIds(container);

  // Filter products: remove those already selected
  const availableProducts = products.filter((product) => {
    let productId;
    if (isRawProduct) {
      productId = product._id;
    } else {
      productId = product.product._id;
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
  //@ts-expect-error ignoring ts error here
  row.innerHTML = productRowTemplate(availableProducts, isRawProduct);

  // Elements
  const toggleBtn = row.querySelector('.dropdown-toggle') as HTMLButtonElement;
  const menu = row.querySelector('.dropdown-menu') as HTMLElement;
  const thumb = row.querySelector('.dropdown-thumb') as HTMLImageElement;
  const limitInput = row.querySelector('.limitInput') as HTMLInputElement;

  // Toggle dropdown
  toggleBtn?.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });

  // Selection logic
  (menu.querySelectorAll('.product-option') as NodeListOf<HTMLElement>).forEach(
    (item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const name = item.dataset.name;
        const img = item.dataset.img || '';
        const qty = item.dataset.qty;

        // Set product ID
        toggleBtn.dataset.value = id;

        if (!isRawProduct) {
          toggleBtn.querySelector('span')!.textContent =
            `${name} (Quantity: ${qty})`;
        } else {
          toggleBtn.querySelector('span')!.textContent = name ? name : null;
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

        if (!id) return;
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
          Boolean(isRawProduct),
          existingProductIds
        );
      });
    }
  );

  container.appendChild(row);
}

// Update all product dropdowns to reflect current selections
function updateAllProductDropdowns(
  container: HTMLElement,
  products: InventoryProduct[],
  isRawProduct: boolean,
  existingProductIds: Set<string>
) {
  const selectedIds = getSelectedProductIds(container);

  const rows = container.querySelectorAll('.product-row');

  rows.forEach((row) => {
    const btn = row.querySelector('.dropdown-toggle') as HTMLButtonElement;
    const currentValue = btn.dataset.value;
    const menu = row.querySelector('.dropdown-menu') as HTMLElement;
    const limitInput = row.querySelector('.limitInput') as HTMLInputElement;

    // Compute available products for this row
    const availableProducts = products.filter((p) => {
      const id = isRawProduct ? p._id : p.product._id;
      return !selectedIds.includes(id) || id === currentValue;
    });

    // Rebuild dropdown menu
    //@ts-expect-error ignoring ts error here
    menu.innerHTML = productOptionsTemplate(availableProducts, isRawProduct);

    // Rebind selection logic
    (
      menu.querySelectorAll('.product-option') as NodeListOf<HTMLElement>
    ).forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const name = item.dataset.name;
        const img = item.dataset.img;
        const qty = item.dataset.qty;

        btn.dataset.value = id;
        btn.querySelector('span')!.textContent = isRawProduct
          ? name + ''
          : `${name} (Quantity: ${qty})`;

        const thumb = btn.querySelector('.dropdown-thumb') as HTMLImageElement;

        if (img && img.trim() !== '') {
          thumb.src = img;
          thumb.classList.remove('d-none');
        } else {
          thumb.classList.add('d-none');
        }

        menu.style.display = 'none';

        //Update limit input dynamically
        if (!id) return;

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
