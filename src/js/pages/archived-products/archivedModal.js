import { setSelectedProduct } from './archivedEvents.js';
import { qrCodeFetch } from '../../common/api/productApiHelper.js';
import archivedSelection from './archivedSelector.js';

let currentImages = [];
let currentIndex = 0;

export const openArchivedModal = async (product) => {

  setSelectedProduct(product._id);

  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  currentIndex = 0;
  archivedSelection.carouselImage.src = currentImages[0];

  archivedSelection.modalProductName.textContent = product.name;
  archivedSelection.modalDescription.textContent =
    product.description || 'No description available.';
  archivedSelection.modalPrice.textContent = product.price ?? 'N/A';
  archivedSelection.modalCategory.textContent =
    product.category ?? 'Not categorized';

  // QR Code
  const qr = await qrCodeFetch(product._id);
  archivedSelection.qrCodeImage.src = URL.createObjectURL(qr.data);

  archivedSelection.productModal.classList.remove('hidden');

  // restore button
  archivedSelection.deleteProductBtn.textContent = 'Restore Product';

  // open confirm restore modal
  archivedSelection.deleteProductBtn.onclick = () => {
    archivedSelection.confirmDeleteModal.classList.remove('hidden');
  };
};

// carousel left
archivedSelection.prevBtn.addEventListener('click', () => {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  archivedSelection.carouselImage.src = currentImages[currentIndex];
});

// carousel right
archivedSelection.nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  archivedSelection.carouselImage.src = currentImages[currentIndex];
});

// close modal
archivedSelection.closeModalBtn.addEventListener('click', () => {
  archivedSelection.productModal.classList.add('hidden');
});
