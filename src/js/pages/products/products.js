import '../../../scss/products.scss';
import api from '../../api/interceptor';
import config from '../../config/config';

const productGrid = document.getElementById('productGrid');

async function fetchProducts() {
  try {
    const res = await api.get(config.PRODUCT_BASE_URL);
    const { success, data } = res.data;

    if (!success || !data) {
      showEmptyState();
      return;
    }

    if (data.length === 0) {
      showEmptyState();
      return;
    }

    renderProducts(data);
  } catch (err) {
    console.error('Error fetching products:', err);
    showErrorState();
  }
}

function renderProducts(products) {
  productGrid.classList.remove('empty', 'error');
  productGrid.innerHTML = '';

  products.forEach((product) => {
    const imgSrc =
      product.productImage && product.productImage.length > 0
        ? product.productImage[0]
        : '/images/placeholder.png';

    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" />
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">${
          product.description || 'No description available.'
        }</p>
        <div class="info-row">
          <span class="price">$${product.price ?? 'N/A'}</span>
          <span class="category">${product.category ?? 'Uncategorized'}</span>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function showEmptyState() {
  productGrid.classList.add('empty');
  productGrid.innerHTML = `<div>No products found.</div>`;
}

function showErrorState() {
  productGrid.classList.add('error');
  productGrid.innerHTML = `<div>Failed to load products. Please try again.</div>`;
}

fetchProducts();
