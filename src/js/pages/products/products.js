import '../../../scss/products.scss';
import api from '../../api/interceptor';
import config from '../../config/config';

const productGrid = document.getElementById('productGrid');

// async function fetchProducts() {
//   try {
//     const res = await api.get(config.PRODUCT_BASE_URL);
//     const { success, data } = res.data;

//     if (!success || !data) {
//       showEmptyState();
//       return;
//     }

//     if (data.length === 0) {
//       showEmptyState();
//       return;
//     }

//     renderProducts(data);
//   } catch (err) {
//     console.error('Error fetching products:', err);
//     showErrorState();
//   }
// }

async function fetchProducts(warehouseId = '690c2b38228835fa4cd40184') {
  try {
    const url = warehouseId
      ? `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
      : config.PRODUCT_BASE_URL;

    const res = await api.get(url);
    console.log(res);
    const { success, data } = res.data;
    console.log(success, data);

    if (!success || !data || data.length === 0) {
      showEmptyState();
      return;
    }

    renderProducts(data);
  } catch (err) {
    console.error('Error fetching products:', err);
    showErrorState();
  }
}

function renderProducts(details) {
  productGrid.classList.remove('empty', 'error');
  productGrid.innerHTML = '';

  details.forEach((detail) => {
    const imgSrc =
      detail.productImage && detail.productImage.length > 0
        ? detail.productImage[0]
        : '/images/placeholder.png';

    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${imgSrc}" alt="${detail.product.name}" />
      <div class="card-body">
        <h5 class="card-title">${detail.product.name}</h5>
        <p class="card-text">${
          detail.product.description || 'No description available.'
        }</p>
        <div class="info-row">
          <span class="price">$${detail.product.price ?? 'N/A'}</span>
          <span class="category">${detail.product.category ?? 'Not Categorized'}</span>
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
