import {
  fetchProductQuantityWarehouse,
  fetchProductSpecificWarehouses,
  fetchTotalProductQuantity,
  qrCodeFetch,
} from '../../common/api/productApiHelper';
import {
  deleteProductHandler,
  editProductHandler,
  handleDelete,
  handleEditProductSubmit,
} from './productEvents';
import { productSelection } from './productSelector';
import { getCurrentUser } from '../../common/api/HelperApi';

let currentImageIndex = 0;
let currentImages = [];
let selectedProductId = null;

productSelection.closeModalBtn.addEventListener('click', () =>
  productSelection.modal.classList.add('hidden')
);

window.addEventListener('click', (e) => {
  if (e.target === productSelection.modal) {
    productSelection.modal.classList.add('hidden');
  }
});

productSelection.cancelDeleteBtn.addEventListener('click', () => {
  productSelection.confirmDeleteModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === productSelection.confirmDeleteModal) {
    productSelection.confirmDeleteModal.classList.add('hidden');
  }
});

export const openProductModal = async (product) => {
  selectedProductId = product._id;

  const user = await getCurrentUser();

  if (user.role !== 'admin') {
    productSelection.deleteProductBtn.style.display = 'none';
  } else {
    productSelection.deleteProductBtn.style.display = 'block';
  }

  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  currentImageIndex = 0;
  productSelection.carouselImg.src = currentImages[0];

  productSelection.modalProductName.textContent = product.name;
  productSelection.modalDescription.textContent =
    product.description || 'No description available.';
  productSelection.modalPrice.textContent = product.price ?? 'N/A';
  productSelection.modalCategory.textContent =
    product.category ?? 'Not Categorized';
  productSelection.modalMarkup.textContent = product.markup ?? '10';
  productSelection.modalMarkupPrice.textContent = (
    product.price +
    (product.price * (product.markup || 10)) / 100
  ).toFixed(2);

  await loadQuantityInfo(selectedProductId);

  const qrCode = await qrCodeFetch(selectedProductId);

  const imageUrl = URL.createObjectURL(qrCode.data);
  productSelection.qrCodeItem.src = imageUrl;

  productSelection.modal.classList.remove('hidden');
};

productSelection.prev.addEventListener('click', () => {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  productSelection.carouselImg.src = currentImages[currentImageIndex];
});

productSelection.next.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  productSelection.carouselImg.src = currentImages[currentImageIndex];
});

async function loadQuantityInfo(productId) {
  try {
    let params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');

    if (filter !== 'warehouses') {
      productSelection.quantitySection.innerHTML = '';
      return;
    }

    const user = await getCurrentUser();
    productSelection.quantitySection.innerHTML = 'Loading quantity...';

    params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId') || user.warehouseId;

    if (user.role === 'manager') {
      const res = await fetchProductQuantityWarehouse(productId, warehouseId);

      const qty = res.data.data[0].quantity;
      productSelection.quantitySection.innerHTML = `
        <p><strong>Quantity in this Warehouse:</strong> ${qty}</p>
        ${qty <= res.data.data[0].limit ? `<button class="btn btn-danger low-stock"> ⚠ LOW STOCK</button>` : ''}
      `;
    } else {
      const totalRes = await fetchTotalProductQuantity(productId);

      let totalQty = totalRes.data.data[0].quantity ?? 0;

      const listRes = await fetchProductSpecificWarehouses(productId);

      const warehouseList = listRes.data.data
        .map(
          (warehouse) =>
            `<li>${warehouse.warehouseId?.name}: <strong>${warehouse.quantity}</strong>
            ${totalQty <= totalRes.data.data[0].limit ? `<button class="btn btn-danger btn-sm low-stock"> ⚠ LOW STOCK</button>` : ''}</li>`
        )
        .join('');

      productSelection.quantitySection.innerHTML = `
        <p><strong>Total Quantity Across Warehouses:</strong> ${totalQty}</p>
        <hr/>
        <p><strong>Warehouses:</strong></p>
        <ul>${warehouseList}</ul>
      `;
    }
  } catch {
    productSelection.quantitySection.innerHTML = 'Error loading quantity.';
  }
}

productSelection.editProductBtn.addEventListener('click', editProductHandler);

productSelection.editProductForm.addEventListener('submit', (e) => {
  handleEditProductSubmit(e, selectedProductId);
});

productSelection.deleteProductBtn.addEventListener(
  'click',
  deleteProductHandler
);

productSelection.confirmDeleteBtn.addEventListener('click', () => {
  handleDelete(selectedProductId);
});
