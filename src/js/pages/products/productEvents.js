import { productSelection } from './productSelector.js';
import {
  openModal,
  closeModal,
  showToast,
  // resetSearchFilters,
} from '../../common/template/productTemplate.js';
import {
  addProduct,
  deleteProduct,
  editProduct,
} from '../../common/api/productApiHelper.js';
import { loadProducts } from './productSubscribe.js';
import { getCurrentUser } from '../../common/api/HelperApi.js';

export const initEvents = () => {
  productSelection.addProductsButton.addEventListener('click', openModal);
  productSelection.closeModalButton.addEventListener('click', closeModal);
  productSelection.addProductForm.addEventListener('submit', handleAddProduct);
};

export const handleAddProduct = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const user = await getCurrentUser();

  formData.append('name', productSelection.addProductForm.productName.value);
  formData.append(
    'category',
    productSelection.addProductForm.productCategory.value
  );
  formData.append(
    'description',
    productSelection.addProductForm.productDescription.value
  );
  formData.append('price', productSelection.addProductForm.productPrice.value);
  formData.append('markup', productSelection.addProductForm.markup.value);
  formData.append('createdBy', user._id);

  [...productSelection.addProductForm.productImage.files].forEach((file) =>
    formData.append('productImage', file)
  );

  try {
    const res = await addProduct(formData);

    if (!res.data.success) {
      return showToast('error', 'Failed to add product');
    }

    showToast('success', res.data.message);

    productSelection.addProductForm.reset();
    closeModal();

    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');

    loadProducts({ warehouseId, page: 1 });
  } catch (err) {
    console.error(err);
    showToast('error', 'Error adding product');
  }
};

export function editProductHandler() {
  productSelection.editName.value =
    productSelection.modalProductName.textContent;

  productSelection.editDescription.value =
    productSelection.modalDescription.textContent;

  productSelection.editCategory.value =
    productSelection.modalCategory.textContent;

  productSelection.editPrice.value = productSelection.modalPrice.textContent;

  productSelection.editMarkup.value = productSelection.modalMarkup.textContent;

  productSelection.editModal.classList.remove('hidden');
}

productSelection.closeEditModal.addEventListener('click', () =>
  productSelection.editModal.classList.add('hidden')
);

window.addEventListener('click', (e) => {
  if (e.target === productSelection.editModal) {
    productSelection.editModal.classList.add('hidden');
  }
});

export const handleEditProductSubmit = async (e, selectedProductId) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', productSelection.editName.value);
  formData.append('description', productSelection.editDescription.value);
  formData.append('category', productSelection.editCategory.value);
  formData.append('price', productSelection.editPrice.value);
  formData.append('markup', productSelection.editMarkup.value);

  const files = productSelection.editImages.files;

  for (let i = 0; i < files.length; i++) {
    formData.append('productImage', files[i]);
  }

  try {
    const res = await editProduct(formData, selectedProductId);
    productSelection.editModal.classList.add('hidden');
    productSelection.modal.classList.add('hidden');
    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');
    loadProducts({ warehouseId, page: 1 });

    showToast('success', res.data.message);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to update product');
  }
};

export function deleteProductHandler() {
  productSelection.confirmDeleteModal.classList.remove('hidden');
}

export async function handleDelete(selectedProductId) {
  try {
    const res = await deleteProduct(selectedProductId);

    productSelection.confirmDeleteModal.classList.add('hidden');
    productSelection.modal.classList.add('hidden');

    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');

    loadProducts({ warehouseId, page: 1 });
    showToast('success', res.data.message);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to delete product');
  }
}
