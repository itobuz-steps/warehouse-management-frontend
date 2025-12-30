import { setSelectedProduct } from './archivedEvents.js';
import { qrCodeFetch } from '../../common/api/productApiHelper.js';
import archivedSelection from './archivedSelector.js';

let currentImages = [];
let imageTimeout = null;
let currentImageIndex = 0;

function initializeCarousel(images) {
  currentImages = images;
  currentImageIndex = 0;

  const carouselImage = document.getElementById('carouselImage');
  const carouselDots = document.querySelector('.carousel-dots');

  carouselImage.src = currentImages[currentImageIndex];

  // create the dots dynamically
  carouselDots.innerHTML = '';
  currentImages.forEach((image, index) => {
    const dot = document.createElement('span');
    dot.dataset.index = index;
    carouselDots.appendChild(dot);

    dot.addEventListener('click', () => {
      clearInterval(imageTimeout);
      currentImageIndex = index;
      updateCarousel();
      startAutoSlide();
    });
  });

  updateCarousel();

  // start the auto-slide
  startAutoSlide();
}

// function to update carousel
function updateCarousel() {
  const carouselImage = document.getElementById('carouselImage');
  const dots = document.querySelectorAll('.carousel-dots span');

  carouselImage.src = currentImages[currentImageIndex];

  // update the active dot
  dots.forEach((dot) => dot.classList.remove('active'));
  dots[currentImageIndex].classList.add('active');
}

function startAutoSlide() {
  imageTimeout = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateCarousel();
  }, 5000);
}

export const openArchivedModal = async (product) => {

  setSelectedProduct(product._id);

  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  initializeCarousel(currentImages);

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
