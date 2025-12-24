import Templates from '../Templates.js';
import { productSelection } from '../../pages/products/productSelector.js';

const templates = new Templates();

export const showToast = (type, msg) => {
  productSelection.toastSection.innerHTML =
    type === 'success'
      ? templates.successToast(msg)
      : templates.errorToast(msg);

  setTimeout(() => (productSelection.toastSection.innerHTML = ''), 3000);
};

export const resetSearchFilters = () => {
  productSelection.searchInput.value = '';
  productSelection.categoryFilter.value = '';
  productSelection.sortSelect.value = '';
};

export const updateWarehouseVisibility = (filter) => {
  productSelection.warehouseSelect.disabled = filter !== 'warehouses';

  Array.from(productSelection.sortSelect.options).forEach((option) => {
    if (option.value === 'quantity_asc' || option.value === 'quantity_desc') {
      option.style.display = filter === 'warehouses' ? 'block' : 'none';
    }
  });
};

export const showEmptyState = (msg = 'No products found.') => {
  productSelection.productGrid.className = 'empty';
  productSelection.productGrid.innerHTML = `<div>${msg}</div>`;
  productSelection.pagination.innerHTML = '';
};

export const showErrorState = () => {
  productSelection.productGrid.className = 'error';
  productSelection.productGrid.innerHTML = `<div>Failed to load products. Please try again.</div>`;
  productSelection.pagination.innerHTML = '';
};

export const openModal = () => {
  productSelection.addProductModal.style.display = 'flex';
};

export const closeModal = () => {
  productSelection.addProductModal.style.display = 'none';
};

export const populateWarehouseSelect = (
  warehouses,
  element,
  defaultOption = false
) => {
  if (!defaultOption) {
    element.innerHTML = '';
  }

  warehouses.forEach((warehouse) => {
    const option = document.createElement('option');
    option.value = warehouse._id;
    option.textContent = warehouse.name;
    element.appendChild(option);
  });
};

export function createProductCard(product) {
  const imgSrc = product.productImage?.[0] ?? '/images/placeholder.png';

  return `
    <div class="card-image-wrapper">
      <img src="${imgSrc}" alt="${product.name}" />
      <span class="category-badge">${product.category ?? 'Uncategorized'}</span>
    </div>
    <hr>
    <div class="card-body">
      <h5 class="mb-0">${product.name}</h5>

      <div class="info-row">
        <span class="price">₹${product.price ?? 'N/A'}</span>
        <!--<span class="category">${product.category ?? 'Not Categorized'}</span>-->
        <span class="markup">Markup: ${product.markup ?? '10'}% <i class="fa-solid fa-arrow-trend-up"></i></span>
      </div>
      <div class="d-flex justify-content-center justify-content-lg-start">
        <button 
        class="btn theme-button w-100" 
        id="viewDetails"
        type="button"
        data-product='${JSON.stringify(product)}'
      >
        View Details <i class="fa-solid fa-arrow-right-to-bracket"></i>
      </button>
      </div>
    </div>
  `;
}

export function managerProductQuantity(product) {
  const isLow = product.quantity <= product.limit;

  return `
    <div class="manager-qty-card ${isLow ? 'low' : ''}">
      <div class="qty-row">
        <span class="qty-text">
          Quantity: <strong>${product.quantity}</strong>
          <span class="qty-limit">(Limit: ${product.limit})</span>
        </span>

        ${
          isLow
            ? `<i class="fa-solid fa-arrow-trend-down low-stock-icon"></i>`
            : ''
        }
      </div>

      <button
        class="btn btn-outline-soft btn-sm edit-limit-btn w-100"
        data-id="${product._id}"
        data-limit="${product.limit}"
      >
        <i class="fa-regular fa-pen-to-square"></i>
        Edit Limit
      </button>
    </div>
  `;
}

export function warehouseProductList(products) {
  return products
    .map(
      (product) => `
        <div class="manager-qty-card col-12 col-sm-5 ${product.quantity <= product.limit ? 'low' : ''}">
          <div class="qty-row">
            <span class="qty-text">
              <strong>${product.warehouseId?.name}: </strong>${product.quantity}
            </span>
            <div class="qty-limit-row">
              ${
                product.quantity <= product.limit
                  ? `<i class="fa-solid fa-arrow-trend-down low-stock-icon"></i>`
                  : ''
              }
            </div>
          </div>

          <!-- Edit Limit Button -->
          <button 
            class="btn btn-outline-soft btn-sm edit-limit-btn w-100"
            data-id="${product._id}"
            data-limit="${product.limit}">
            <i class="fa-regular fa-pen-to-square"></i> Edit Limit
          </button>
        </div>
      `
    )
    .join('');
}
