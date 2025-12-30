import '../../../scss/products.scss';
import { initializeCarousel } from '../../common/imageCarousel';
import config from '../../config/config';
import { productSelection } from '../products/productSelector';

document.addEventListener('DOMContentLoaded', async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  // console.log(id);

  const result = await fetch(`${config.PRODUCT_BASE_URL}/qr/${id}`, {
    method: 'POST',
  });
  const product = await result.json();
  // console.log(product);

  initializeCarousel({
    images: product.data.productImage,
  });

  productSelection.modalProductName.textContent = product.data.name;
  productSelection.modalDescription.textContent =
    product.data.description || 'No description available.';
  productSelection.modalPrice.textContent = product.data.price ?? 'N/A';
  productSelection.modalCategory.textContent =
    product.data.category ?? 'Not Categorized';
  productSelection.modalMarkup.textContent = product.data.markup ?? '10';
  productSelection.modalMarkupPrice.textContent = (
    product.data.price +
    (product.data.price * (product.data.markup || 10)) / 100
  ).toFixed(2);
});
