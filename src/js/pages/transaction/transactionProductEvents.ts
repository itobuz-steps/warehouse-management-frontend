// js/pages/transaction/transactionProductEvents.js
import { addProduct } from '../../common/api/productApiHelper.js';
import { getCurrentUser } from '../../common/api/helperApi.js';
import { Templates } from '../../common/Templates.js';
import { displayProducts } from './displayProducts.js';
import { AxiosError } from 'axios';

const toastMessage = new Templates();

const getProductModalElements = () => ({
  modal: document.getElementById('addProductModalTransaction') as HTMLElement,
  form: document.getElementById('addProductFormTransaction') as HTMLFormElement,
  closeBtn: document.getElementById(
    'closeProductModalTransaction'
  ) as HTMLButtonElement,
  addBtn: document.getElementById('addNewProductBtn') as HTMLButtonElement,
  toastSection: document.getElementById('toastSection') as HTMLElement,
});

export function initTransactionProductEvents() {
  const { addBtn, closeBtn, form, modal } = getProductModalElements();

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

export const showToast = (type: 'success' | 'error', msg: string) => {
  const { toastSection } = getProductModalElements();
  if (toastSection) {
    toastSection.innerHTML =
      type === 'success'
        ? toastMessage.successToast(msg)
        : toastMessage.errorToast(msg);
    setTimeout(() => (toastSection.innerHTML = ''), 3000);
  }
};

export const handleAddProductTransaction = async (e: Event) => {
  e.preventDefault();

  const { form } = getProductModalElements();
  const formData = new FormData();
  const user = await getCurrentUser();

  formData.append(
    'name',
    (document.getElementById('transactionProductName') as HTMLInputElement)
      ?.value
  );
  formData.append(
    'category',
    (document.getElementById('transactionProductCategory') as HTMLInputElement)
      ?.value
  );
  formData.append(
    'description',
    (
      document.getElementById(
        'transactionProductDescription'
      ) as HTMLInputElement
    )?.value
  );
  formData.append(
    'price',
    (document.getElementById('transactionProductPrice') as HTMLInputElement)
      ?.value
  );
  formData.append(
    'markup',
    (document.getElementById('transactionProductMarkup') as HTMLInputElement)
      ?.value
  );
  formData.append('createdBy', user._id);

  const productImageInput = document.getElementById(
    'transactionProductImage'
  ) as HTMLInputElement;
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
    const transactionType = (
      document.getElementById('transactionType') as HTMLSelectElement
    ).value;

    if (transactionType === 'IN') {
      displayProducts('IN');
    }
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      console.error(err);
      return;
    }

    console.error(err);
    showToast('error', err.response?.data?.message || 'Error adding product');
  }
};
