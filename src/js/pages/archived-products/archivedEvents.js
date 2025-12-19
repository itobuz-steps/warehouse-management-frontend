import { restoreProduct } from '../../common/api/productApiHelper.js';
import { showToast } from '../../common/template/productTemplate.js';
import archivedSelection from './archivedSelector.js';
import { loadArchivedProducts } from './archivedSubscribe.js';

let selectedProductId = null;

export const initArchivedEvents = () => {
  // close modal
  archivedSelection.cancelDeleteBtn.addEventListener('click', () => {
    archivedSelection.confirmDeleteModal.classList.add('hidden');
  });

  archivedSelection.confirmDeleteBtn.addEventListener('click', async () => {
    try {
      const res = await restoreProduct(selectedProductId);

      showToast('success', res.data.message);

      archivedSelection.confirmDeleteModal.classList.add('hidden');
      archivedSelection.productModal.classList.add('hidden');

      await loadArchivedProducts();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to restore product');
    }
  });

  // close modal on outside click
  window.addEventListener('click', (e) => {
    const modal = archivedSelection.confirmDeleteModal;

    if (e.target === modal) {
      modal.classList.add('hidden');
    }
    
  });
};

// Called from openArchivedModal
export const setSelectedProduct = (id) => {
  selectedProductId = id;
};
