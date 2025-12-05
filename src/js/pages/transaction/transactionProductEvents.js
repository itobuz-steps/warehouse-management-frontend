// js/pages/transaction/transactionProductEvents.js
import { addProduct } from '../../common/api/productApiHelper.js';
import { getCurrentUser } from '../../common/api/HelperApi.js';
import Templates from '../../common/Templates.js';
import { displayProducts } from './displayProducts.js';

const toastMessage = new Templates();

const getProductModalElements = () => ({
  modal: document.getElementById('addProductModalTransaction'),
  form: document.getElementById('addProductFormTransaction'),
  closeBtn: document.getElementById('closeProductModalTransaction'),
  addBtn: document.getElementById('addNewProductBtn'),
  toastSection: document.getElementById('toastSection'),
});

export function initTransactionProductEvents() {
  const { addBtn, closeBtn, form, modal } = getProductModalElements();

  console.log('Initializing transaction product events', {
    addBtn,
    closeBtn,
    form,
    modal,
  });

  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProductModal);
  }

  if (form) {
    form.addEventListener('submit', handleAddProductTransaction);
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProductModal();
    }
  });
}

export const openProductModal = () => {
  const { modal } = getProductModalElements();
  console.log('Opening modal:', modal);
  if (modal) {
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
  }
};

export const closeProductModal = () => {
  const { modal, form } = getProductModalElements();
  if (modal) {
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
  }
  if (form) {
    form.reset();
  }
};

export const showToast = (type, msg) => {
  const { toastSection } = getProductModalElements();
  if (toastSection) {
    toastSection.innerHTML =
      type === 'success'
        ? toastMessage.successToast(msg)
        : toastMessage.errorToast(msg);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
};

export const handleAddProductTransaction = async (e) => {
  e.preventDefault();

  const { form } = getProductModalElements();
  const formData = new FormData();
  const user = await getCurrentUser();

  formData.append(
    'name',
    document.getElementById('transactionProductName').value
  );
  formData.append(
    'category',
    document.getElementById('transactionProductCategory').value
  );
  formData.append(
    'description',
    document.getElementById('transactionProductDescription').value
  );
  formData.append(
    'price',
    document.getElementById('transactionProductPrice').value
  );
  formData.append('createdBy', user._id);

  const productImageInput = document.getElementById('transactionProductImage');
  if (productImageInput && productImageInput.files) {
    [...productImageInput.files].forEach((file) =>
      formData.append('productImage', file)
    );
  }

  try {
    const res = await addProduct(formData);

    if (!res.data.success) {
      return showToast('error', 'Failed to add product');
    }

    showToast('success', res.data.message);

    // Reset form and close modal
    if (form) {
      form.reset();
    }
    closeProductModal();

    // Refresh products for the current transaction type and warehouse
    const transactionType = document.getElementById('transactionType').value;

    if (transactionType === 'IN') {
      displayProducts('IN');
    }
  } catch (err) {
    console.error(err);
    showToast('error', err.response?.data?.message || 'Error adding product');
  }
};
