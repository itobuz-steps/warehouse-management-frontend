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
    <img src="${imgSrc}" alt="${product.name}" />
    <hr>
    <div class="card-body">
      <h5>${product.name}</h5>

      <div class="info-row">
        <span class="price">₹${product.price ?? 'N/A'}</span>
        <span class="category">${product.category ?? 'Not Categorized'}</span>
      </div>
      <div class="d-flex justify-content-center justify-content-lg-start">
        <button 
        class="btn theme-button" 
        id="viewDetails"
        type="button"
        data-product='${JSON.stringify(product)}'
      >
        View Details
      </button>
      </div>
    </div>
  `;
}

export function managerProductQuantity(product) {
  return `
        <div class="d-flex gap-2 align-items-center mb-2">
          <p class="mb-0"><strong>Quantity:</strong> ${product.quantity}</p>

          ${
            product.quantity <= product.limit
              ? `<button class="btn btn-danger btn-sm low-stock">
                <i class="fa-solid fa-arrow-trend-down"></i>
              </button>`
              : ''
          }

          <button 
            class="btn btn-outline-soft btn-sm edit-limit-btn"
            data-id="${product._id}"
            data-limit="${product.limit}">
            <i class="fa-regular fa-pen-to-square"></i> Limit
          </button>
        </div>
      `;
}

export function warehouseProductList(products) {
  return products
    .map(
      (product) => `
        <li>
          ${product.warehouseId?.name}: <strong>${product.quantity}</strong>
          ${
            product.quantity <= product.limit
              ? `<button class="btn btn-danger btn-sm low-stock my-1">
                   <i class="fa-solid fa-arrow-trend-down"></i>
                 </button>`
              : ''
          }
          <button 
            class="btn btn-outline-soft btn-sm edit-limit-btn"
            data-id="${product._id}"
            data-limit="${product.limit}">
            <i class="fa-regular fa-pen-to-square"></i> Limit
          </button>
        </li>
      `
    )
    .join('');
}
