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
