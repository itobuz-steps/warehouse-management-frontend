import Templates from '../../common/Templates.js';
import { dom } from './productSelector.js';

const templates = new Templates();

export const showToast = (type, msg) => {
  dom.toastSection.innerHTML =
    type === 'success'
      ? templates.successToast(msg)
      : templates.errorToast(msg);

  setTimeout(() => (dom.toastSection.innerHTML = ''), 3000);
};

export const resetSearchFilters = () => {
  dom.searchInput.value = '';
  dom.categoryFilter.value = '';
  dom.sortSelect.value = '';
};

export const updateWarehouseVisibility = (filter) => {
  dom.warehouseSelect.disabled = filter !== 'warehouses';

  Array.from(dom.sortSelect.options).forEach((option) => {
    if (option.value === 'quantity_asc' || option.value === 'quantity_desc') {
      option.style.display = filter === 'warehouses' ? 'block' : 'none';
    }
  });
};

export const showEmptyState = (msg = 'No products found.') => {
  dom.productGrid.className = 'empty';
  dom.productGrid.innerHTML = `<div>${msg}</div>`;
  dom.pagination.innerHTML = '';
};

export const showErrorState = () => {
  dom.productGrid.className = 'error';
  dom.productGrid.innerHTML = `<div>Failed to load products. Please try again.</div>`;
  dom.pagination.innerHTML = '';
};

export const openModal = () => {
  dom.addProductModal.style.display = 'flex';
};

export const closeModal = () => {
  dom.addProductModal.style.display = 'none';
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
