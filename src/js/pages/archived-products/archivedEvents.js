import { restoreProduct } from '../../common/api/productApiHelper.js';
import { showToast } from '../../common/template/productTemplate.js';
import { loadArchivedProducts } from './archivedSubscribe.js';

let selectedProductId = null;

export const initArchivedEvents = () => {
  // close modal
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('confirmDeleteModal').classList.add('hidden');
  });

  document
    .getElementById('confirmDeleteBtn')
    .addEventListener('click', async () => {
      try {
        const res = await restoreProduct(selectedProductId);

        showToast('success', res.data.message);

        document.getElementById('confirmDeleteModal').classList.add('hidden');
        document.getElementById('productModal').classList.add('hidden');

        await loadArchivedProducts();
      } catch (err) {
        console.error(err);
        showToast('error', 'Failed to restore product');
      }
    });

  // close modal on outside click
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('confirmDeleteModal');
    if (e.target === modal) modal.classList.add('hidden');
  });
};

// Called from openArchivedModal
export const setSelectedProduct = (id) => {
  selectedProductId = id;
};
