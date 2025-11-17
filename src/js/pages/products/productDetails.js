import {
  fetchProductQuantityWarehouse,
  fetchProductSpecificWarehouses,
  fetchTotalProductQuantity,
  getCurrentUser,
} from './productApiHelper';

const modal = document.getElementById('productModal');
const closeModalBtn = document.querySelector('.close-modal');
const carouselImg = document.getElementById('carouselImage');

let currentImageIndex = 0;
let currentImages = [];

closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

export const openProductModal = async (product) => {
  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  currentImageIndex = 0;
  carouselImg.src = currentImages[0];

  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalDescription').textContent =
    product.description || 'No description available.';
  document.getElementById('modalPrice').textContent = product.price ?? 'N/A';
  document.getElementById('modalCategory').textContent =
    product.category ?? 'Not Categorized';

  await loadQuantityInfo(product._id);

  modal.classList.remove('hidden');
};

document.querySelector('.prev').addEventListener('click', () => {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  carouselImg.src = currentImages[currentImageIndex];
});

document.querySelector('.next').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  carouselImg.src = currentImages[currentImageIndex];
});

async function loadQuantityInfo(productId) {
  const user = await getCurrentUser();
  const quantitySection = document.getElementById('quantitySection');
  quantitySection.innerHTML = 'Loading quantity...';

  const params = new URLSearchParams(window.location.search);
  const warehouseId = params.get('warehouseId') || user.warehouseId;

  try {
    if (user.role === 'manager') {
      const res = await fetchProductQuantityWarehouse(productId, warehouseId);
      console.log(productId, warehouseId);

      const qty = res.data.data[0].quantity;
      quantitySection.innerHTML = `
        <p><strong>Quantity in this Warehouse:</strong> ${qty}</p>
        ${qty <= 10 ? `<button class="btn btn-danger low-stock">⚠ LOW STOCK</button>` : ''}
      `;
    } else {
      const totalRes = await fetchTotalProductQuantity(productId);
      console.log(totalRes)

      let totalQty = totalRes.data.data[0].quantity ?? 0;

      const listRes = await fetchProductSpecificWarehouses(productId);
      console.log(listRes)

      const warehouseList = listRes.data.data
        .map(
          (warehouse) =>
            `<li>${warehouse.warehouseId?.name}: <strong>${warehouse.quantity}</strong></li>`
        )
        .join('');

      quantitySection.innerHTML = `
        <p><strong>Total Quantity Across Warehouses:</strong> ${totalQty}</p>
        ${totalQty <= 10 ? `<button class="btn btn-danger low-stock">⚠ LOW STOCK</button>` : ''}
        <hr/>
        <p><strong>Warehouses:</strong></p>
        <ul>${warehouseList}</ul>
      `;
    }
  } catch {
    quantitySection.innerHTML = 'Error loading quantity.';
  }
}
