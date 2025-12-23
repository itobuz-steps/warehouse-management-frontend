import * as bootstrap from 'bootstrap';
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
import config from '../../config/config';
import api from '../../api/interceptor';
import { showToast } from '../../common/template/productTemplate';

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
        <div class="d-flex gap-2 align-items-center">
          <p class="mb-0"><strong>Quantity:</strong> ${qty}</p>

          ${
            qty <= res.data.data[0].limit
              ? `<button class="btn btn-danger btn-sm low-stock">
                <i class="fa-solid fa-arrow-trend-down"></i>
              </button>`
              : ''
          }

          <button 
            class="btn btn-outline-soft btn-sm edit-limit-btn"
            data-id="${res.data.data[0]._id}"
            data-limit="${res.data.data[0].limit}">
            <i class="fa-regular fa-pen-to-square"></i> Limit
          </button>
        </div>
      `;
    } else {
      const totalRes = await fetchTotalProductQuantity(productId);

      let totalQty = totalRes.data.data[0].quantity ?? 0;

      const listRes = await fetchProductSpecificWarehouses(productId);

      const warehouseList = listRes.data.data
        .map(
          (quantity) =>
            `<li>${quantity.warehouseId?.name}: <strong>${quantity.quantity}</strong>
            ${quantity.quantity <= quantity.limit ? `<button class="btn btn-danger btn-sm low-stock my-1"><i class="fa-solid fa-arrow-trend-down"></i></button>` : ''}
            <button 
              class="btn btn-outline-soft btn-sm edit-limit-btn"
              data-id="${quantity._id}"
              data-limit="${quantity.limit}">
              <i class="fa-regular fa-pen-to-square"></i> Limit
            </button></li>`
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

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.edit-limit-btn');

  if (!btn) {
    return;
  }

  const quantityId = btn.dataset.id;
  const limit = btn.dataset.limit;

  openLimitModal(quantityId, limit);
});

function openLimitModal(quantityId, currentLimit) {
  document.getElementById('limitQuantityId').value = quantityId;
  document.getElementById('limitInput').value = currentLimit;

  const modal = new bootstrap.Modal(document.getElementById('limitModal'));
  modal.show();
}

document.getElementById('saveLimitBtn').addEventListener('click', async () => {
  try {
    const quantityId = document.getElementById('limitQuantityId').value;
    const limit = document.getElementById('limitInput').value;

    const res = await api.put(
      `${config.QUANTITY_BASE_URL}/${quantityId}/limit`,
      {
        limit,
      }
    );

    bootstrap.Modal.getInstance(document.getElementById('limitModal')).hide();
    showToast('success', res.data.message);
  } catch (err) {
    showToast('error', err.response.data.message);
  }
});

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
