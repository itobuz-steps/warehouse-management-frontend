import { setSelectedProduct } from './archivedEvents.js';
import { qrCodeFetch } from '../../common/api/productApiHelper.js';
import archivedSelection from './archivedSelector.js';
import { initializeCarousel } from '../../common/imageCarousel.js';

export const openArchivedModal = async (product) => {
  
  setSelectedProduct(product._id);

  // Use the common carousel utility
  initializeCarousel({
    images: product.productImage,
  });

  archivedSelection.modalProductName.textContent = product.name;
  archivedSelection.modalDescription.textContent =
    product.description || 'No description available.';
  archivedSelection.modalPrice.textContent = product.price ?? 'N/A';
  archivedSelection.modalCategory.textContent =
    product.category ?? 'Not categorized';
  archivedSelection.modalMarkup.textContent = product.markup ?? '10';
  archivedSelection.modalMarkupPrice.textContent = (
    product.price +
    (product.price * (product.markup || 10)) / 100
  ).toFixed(2);

  // QR Code
  const qr = await qrCodeFetch(product._id);
  archivedSelection.qrCodeImage.src = URL.createObjectURL(qr.data);

  archivedSelection.productModal.classList.remove('hidden');

  // open confirm restore modal
  archivedSelection.restoreBtn.onclick = () => {
    archivedSelection.confirmDeleteModal.classList.remove('hidden');
  };
};

// close modal
archivedSelection.closeModalBtn.addEventListener('click', () => {
  archivedSelection.productModal.classList.add('hidden');
});
