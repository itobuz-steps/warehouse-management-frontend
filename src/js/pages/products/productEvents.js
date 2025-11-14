import { dom } from './productSelector.js';
import { openModal, closeModal, showToast } from './productTemplate.js';
import {
  addProduct,
  addProductQuantity,
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

const resetSearchFilters = () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('sortSelect').value = '';
};

const handleAddProduct = async (e) => {
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
    if (!res.data.success) return showToast('error', 'Failed to add product');

    const productId = res.data.data._id;

    await addProductQuantity(
      productId,
      dom.productWarehouseSelect.value,
      dom.addProductForm.productQuantity.value
    );

    showToast('success', 'Product & quantity added successfully');

    dom.addProductForm.reset();
    closeModal();
    fetchProducts();
  } catch (err) {
    console.error(err);
    showToast('error', 'Error adding product');
  }
};
