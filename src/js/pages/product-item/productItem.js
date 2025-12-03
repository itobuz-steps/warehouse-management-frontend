import config from '../../config/config';
import { dom } from '../products/productSelector';

let currentImages = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  console.log(id);

  const result = await fetch(`${config.PRODUCT_BASE_URL}/qr/${id}`, {
    method: 'POST',
  });
  const product = await result.json();
  console.log(product);

  currentImages = product.data.productImage?.length
    ? product.data.productImage
    : ['/images/placeholder.png'];

  dom.carouselImg.src = currentImages[0];

  dom.modalProductName.textContent = product.data.name;
  dom.modalDescription.textContent =
    product.data.description || 'No description available.';
  dom.modalPrice.textContent = product.data.price ?? 'N/A';
  dom.modalCategory.textContent = product.data.category ?? 'Not Categorized';
});

dom.prev.addEventListener('click', () => {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  dom.carouselImg.src = currentImages[currentImageIndex];
});

dom.next.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  dom.carouselImg.src = currentImages[currentImageIndex];
});
