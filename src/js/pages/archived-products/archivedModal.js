import { setSelectedProduct } from './archivedEvents.js';
import { qrCodeFetch } from '../../common/api/productApiHelper.js';

let currentImages = [];
let currentIndex = 0;

export const openArchivedModal = async (product) => {
  const modal = document.getElementById('productModal');
  const img = document.getElementById('carouselImage');

  setSelectedProduct(product._id);

  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  currentIndex = 0;
  img.src = currentImages[0];

  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalDescription').textContent =
    product.description || 'No description available.';
  document.getElementById('modalPrice').textContent = product.price ?? 'N/A';
  document.getElementById('modalCategory').textContent =
    product.category ?? 'Not categorized';

  // QR Code
  const qr = await qrCodeFetch(product._id);
  document.querySelector('.qr-code').src = URL.createObjectURL(qr.data);

  modal.classList.remove('hidden');

  // restore button
  const restoreBtn = document.getElementById('deleteProductBtn');
  restoreBtn.textContent = 'Restore Product';

  // open confirm restore modal
  restoreBtn.onclick = () => {
    document.getElementById('confirmDeleteModal').classList.remove('hidden');
  };
};

// carousel left
document.querySelector('.prev').addEventListener('click', () => {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById('carouselImage').src = currentImages[currentIndex];
});

// carousel right
document.querySelector('.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  document.getElementById('carouselImage').src = currentImages[currentIndex];
});

// close modal
document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('productModal').classList.add('hidden');
});
