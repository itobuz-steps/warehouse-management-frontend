import { dom } from './productSelector.js';
import { openModal, closeModal, showToast } from './productTemplate.js';
import {
  addProduct,
  deleteProduct,
  editProduct,
  getCurrentUser,
} from './productApiHelper.js';
import { fetchProducts } from './productSubscribe.js';

export const initEvents = () => {
  dom.addProductsButton.addEventListener('click', openModal);
  dom.closeModalButton.addEventListener('click', closeModal);

  dom.warehouseSelect.addEventListener('change', (e) => {
    resetSearchFilters();
    fetchProducts(e.target.value);
  });

  dom.addProductForm.addEventListener('submit', handleAddProduct);
};

export const resetSearchFilters = () => {
  dom.searchInput.value = '';
  dom.categoryFilter.value = '';
  dom.sortSelect.value = '';
};

export const handleAddProduct = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const user = await getCurrentUser();

  formData.append('name', dom.addProductForm.productName.value);
  formData.append('category', dom.addProductForm.productCategory.value);
  formData.append('description', dom.addProductForm.productDescription.value);
  formData.append('price', dom.addProductForm.productPrice.value);
  formData.append('createdBy', user._id);

  [...dom.addProductForm.productImage.files].forEach((file) =>
    formData.append('productImage', file)
  );

  try {
    const res = await addProduct(formData);

    if (!res.data.success) {
      return showToast('error', 'Failed to add product');
    }

    showToast('success', res.data.message);

    dom.addProductForm.reset();
    closeModal();

    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');

    fetchProducts(warehouseId);
  } catch (err) {
    console.error(err);
    showToast('error', 'Error adding product');
  }
};

export const editProductHandler = () => {
  dom.editName.value = dom.modalProductName.textContent;
  dom.editDescription.value = dom.modalDescription.textContent;
  dom.editCategory.value = dom.modalCategory.textContent;
  dom.editPrice.value = dom.modalPrice.textContent;

  dom.editModal.classList.remove('hidden');
};

dom.closeEditModal.addEventListener('click', () =>
  dom.editModal.classList.add('hidden')
);

window.addEventListener('click', (e) => {
  if (e.target === dom.editModal) {
    dom.editModal.classList.add('hidden');
  }
});

export const handleEditProductSubmit = async (e, selectedProductId) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', dom.editName.value);
  formData.append('description', dom.editDescription.value);
  formData.append('category', dom.editCategory.value);
  formData.append('price', dom.editPrice.value);

  const files = dom.editImages.files;

  for (let i = 0; i < files.length; i++) {
    formData.append('productImage', files[i]);
  }

  try {
    const res = await editProduct(formData, selectedProductId);
    dom.editModal.classList.add('hidden');
    dom.modal.classList.add('hidden');
    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');
    fetchProducts(warehouseId);

    showToast('success', res.data.message);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to update product');
  }
};

export const deleteProductHandler = () => {
  dom.confirmDeleteModal.classList.remove('hidden');
};

export async function handleDelete(selectedProductId) {
  try {
    const res = await deleteProduct(selectedProductId);

    dom.confirmDeleteModal.classList.add('hidden');
    dom.modal.classList.add('hidden');

    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');

    fetchProducts(warehouseId);
    showToast('success', res.data.message);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to delete product');
  }
}
