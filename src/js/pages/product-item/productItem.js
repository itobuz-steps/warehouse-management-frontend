import config from '../../config/config';
import { productSelection } from '../products/productSelector';

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

  productSelection.carouselImg.src = currentImages[0];

  productSelection.modalProductName.textContent = product.data.name;
  productSelection.modalDescription.textContent =
    product.data.description || 'No description available.';
  productSelection.modalPrice.textContent = product.data.price ?? 'N/A';
  productSelection.modalCategory.textContent =
    product.data.category ?? 'Not Categorized';
});

productSelection.prev.addEventListener('click', () => {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  productSelection.carouselImg.src = currentImages[currentImageIndex];
});

productSelection.next.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  productSelection.carouselImg.src = currentImages[currentImageIndex];
});
