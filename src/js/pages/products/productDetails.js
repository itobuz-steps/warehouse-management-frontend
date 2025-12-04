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
import { dom } from './productSelector';
import { getCurrentUser } from '../../common/api/HelperApi';

let currentImageIndex = 0;
let currentImages = [];
let selectedProductId = null;

dom.closeModalBtn.addEventListener('click', () =>
  dom.modal.classList.add('hidden')
);

window.addEventListener('click', (e) => {
  if (e.target === dom.modal) {
    dom.modal.classList.add('hidden');
  }
});

dom.cancelDeleteBtn.addEventListener('click', () => {
  dom.confirmDeleteModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === dom.confirmDeleteModal) {
    dom.confirmDeleteModal.classList.add('hidden');
  }
});

export const openProductModal = async (product) => {
  selectedProductId = product._id;

  const user = await getCurrentUser();

  if (user.role !== 'admin') {
    dom.deleteProductBtn.style.display = 'none';
  } else {
    dom.deleteProductBtn.style.display = 'block';
  }

  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  currentImageIndex = 0;
  dom.carouselImg.src = currentImages[0];

  dom.modalProductName.textContent = product.name;
  dom.modalDescription.textContent =
    product.description || 'No description available.';
  dom.modalPrice.textContent = product.price ?? 'N/A';
  dom.modalCategory.textContent = product.category ?? 'Not Categorized';

  await loadQuantityInfo(selectedProductId);

  const qrCode = await qrCodeFetch(selectedProductId)

  const imageUrl = URL.createObjectURL(qrCode.data);
  dom.qrCodeItem.src = imageUrl;

  dom.modal.classList.remove('hidden');
};

dom.prev.addEventListener('click', () => {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  dom.carouselImg.src = currentImages[currentImageIndex];
});

dom.next.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  dom.carouselImg.src = currentImages[currentImageIndex];
});

async function loadQuantityInfo(productId) {
  try {
    let params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');

    if (filter !== 'warehouses') {
      dom.quantitySection.innerHTML = '';
      return;
    }

    const user = await getCurrentUser();
    dom.quantitySection.innerHTML = 'Loading quantity...';

    params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId') || user.warehouseId;

    if (user.role === 'manager') {
      const res = await fetchProductQuantityWarehouse(productId, warehouseId);

      const qty = res.data.data[0].quantity;
      dom.quantitySection.innerHTML = `
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

      dom.quantitySection.innerHTML = `
        <p><strong>Total Quantity Across Warehouses:</strong> ${totalQty}</p>
        <hr/>
        <p><strong>Warehouses:</strong></p>
        <ul>${warehouseList}</ul>
      `;
    }
  } catch {
    dom.quantitySection.innerHTML = 'Error loading quantity.';
  }
}

dom.editProductBtn.addEventListener('click', editProductHandler);

dom.editProductForm.addEventListener('submit', (e) => {
  handleEditProductSubmit(e, selectedProductId);
});

dom.deleteProductBtn.addEventListener('click', deleteProductHandler);

dom.confirmDeleteBtn.addEventListener('click', () => {
  handleDelete(selectedProductId);
});
