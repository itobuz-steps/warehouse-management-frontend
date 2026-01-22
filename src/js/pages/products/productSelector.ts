import type { ProductSelection } from './types';

export const productSelection: ProductSelection = {
  toastSection: document.getElementById('toastSection')!,
  productGrid: document.getElementById('productGrid')!,
  warehouseSelect: document.getElementById(
    'warehouseSelect'
  ) as HTMLSelectElement,
  pagination: document.getElementById('pagination')!,
  addProductsButton: document.getElementById(
    'addProducts'
  ) as HTMLButtonElement,
  addProductModal: document.getElementById('addProductModal')!,
  closeModalButton: document.getElementById('closeModal') as HTMLButtonElement,
  addProductForm: document.getElementById('addProductForm') as HTMLFormElement,
  searchInput: document.getElementById('searchInput') as HTMLInputElement,
  categoryFilter: document.getElementById(
    'categoryFilter'
  ) as HTMLSelectElement,
  sortSelect: document.getElementById('sortSelect') as HTMLSelectElement,

  filterTypeSelect: document.getElementById(
    'filterTypeSelect'
  ) as HTMLSelectElement,

  modal: document.getElementById('productModal')!,
  closeModalBtn: document.querySelector('.close-modal')!,
  carouselImg: document.getElementById('carouselImage') as HTMLImageElement,

  modalProductName: document.getElementById('modalProductName')!,
  modalDescription: document.getElementById('modalDescription')!,
  modalPrice: document.getElementById('modalPrice')!,
  modalCategory: document.getElementById('modalCategory')!,
  quantitySection: document.getElementById('quantitySection')!,
  modalMarkup: document.getElementById('modalMarkup')!,
  modalMarkupPrice: document.getElementById('modalMarkupPrice')!,

  qrCodeSection: document.querySelector('#productQr')!,
  qrCodeItem: document.querySelector('.qr-code')!,

  editModal: document.getElementById('editProductModal')!,
  closeEditModal: document.querySelector('.close-edit-modal')!,
  editProductBtn: document.getElementById(
    'editProductBtn'
  ) as HTMLButtonElement,
  editName: document.getElementById('editName') as HTMLInputElement,
  editDescription: document.getElementById(
    'editDescription'
  ) as HTMLTextAreaElement,
  editCategory: document.getElementById('editCategory') as HTMLSelectElement,
  editPrice: document.getElementById('editPrice') as HTMLInputElement,
  editMarkup: document.getElementById('editMarkup') as HTMLInputElement,
  editProductForm: document.getElementById(
    'editProductForm'
  ) as HTMLFormElement,
  editImages: document.getElementById('editImages') as HTMLInputElement,

  deleteProductBtn: document.getElementById(
    'deleteProductBtn'
  ) as HTMLButtonElement,

  prev: document.querySelector('.prev')!,
  next: document.querySelector('.next')!,

  confirmDeleteModal: document.getElementById('confirmDeleteModal')!,
  cancelDeleteBtn: document.getElementById(
    'cancelDeleteBtn'
  ) as HTMLButtonElement,
  confirmDeleteBtn: document.getElementById(
    'confirmDeleteBtn'
  ) as HTMLButtonElement,

  limitQuantityId: document.getElementById(
    'limitQuantityId'
  ) as HTMLInputElement,
  limitInput: document.getElementById('limitInput') as HTMLInputElement,
  limitModal: document.getElementById('limitModal')!,
  saveLimitBtn: document.getElementById('saveLimitBtn') as HTMLButtonElement,
};
