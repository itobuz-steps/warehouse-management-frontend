import {
  deleteProduct,
  editProduct,
  fetchProductQuantityWarehouse,
  fetchProductSpecificWarehouses,
  fetchTotalProductQuantity,
  getCurrentUser,
} from './productApiHelper';
import { dom } from './productSelector';
import { fetchProducts } from './productSubscribe';
import { showToast } from './productTemplate';

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
  const user = await getCurrentUser();
  dom.quantitySection.innerHTML = 'Loading quantity...';

  const params = new URLSearchParams(window.location.search);
  const warehouseId = params.get('warehouseId') || user.warehouseId;

  try {
    if (user.role === 'manager') {
      const res = await fetchProductQuantityWarehouse(productId, warehouseId);

      const qty = res.data.data[0].quantity;
      dom.quantitySection.innerHTML = `
        <p><strong>Quantity in this Warehouse:</strong> ${qty}</p>
        ${qty <= 10 ? `<button class="btn btn-danger low-stock">⚠ LOW STOCK</button>` : ''}
      `;
    } else {
      const totalRes = await fetchTotalProductQuantity(productId);

      let totalQty = totalRes.data.data[0].quantity ?? 0;

      const listRes = await fetchProductSpecificWarehouses(productId);

      const warehouseList = listRes.data.data
        .map(
          (warehouse) =>
            `<li>${warehouse.warehouseId?.name}: <strong>${warehouse.quantity}</strong></li>`
        )
        .join('');

      dom.quantitySection.innerHTML = `
        <p><strong>Total Quantity Across Warehouses:</strong> ${totalQty}</p>
        ${totalQty <= 10 ? `<button class="btn btn-danger low-stock">⚠ LOW STOCK</button>` : ''}
        <hr/>
        <p><strong>Warehouses:</strong></p>
        <ul>${warehouseList}</ul>
      `;
    }
  } catch {
    dom.quantitySection.innerHTML = 'Error loading quantity.';
  }
}

dom.editProductBtn.addEventListener('click', () => {
  dom.editName.value = dom.modalProductName.textContent;
  dom.editDescription.value = dom.modalDescription.textContent;
  dom.editCategory.value = dom.modalCategory.textContent;
  dom.editPrice.value = dom.modalPrice.textContent;

  dom.editModal.classList.remove('hidden');
});

dom.closeEditModal.addEventListener('click', () =>
  dom.editModal.classList.add('hidden')
);

window.addEventListener('click', (e) => {
  if (e.target === dom.editModal) {
    dom.editModal.classList.add('hidden');
  }
});

dom.editProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', dom.editName.value);
  formData.append('description', dom.editDescription.value);
  formData.append('category', dom.editCategory.value);
  formData.append('price', dom.editPrice.value);

  const files = dom.editImages.files;
  for (let i = 0; i < files.length; i++) {
    formData.append('productImage', files[i]);
  }

  try {
    const res = await editProduct(formData, selectedProductId);
    // console.log(res);
    dom.editModal.classList.add('hidden');
    dom.modal.classList.add('hidden');
    const params = new URLSearchParams(window.location.search);
    const warehouseId = params.get('warehouseId');
    fetchProducts(warehouseId);

    showToast('success', res.data.message);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to update product');
  }
});

dom.deleteProductBtn.addEventListener('click', async () => {
  dom.deleteProductBtn.addEventListener('click', () => {
    dom.confirmDeleteModal.classList.remove('hidden');
  });

  dom.confirmDeleteBtn.addEventListener('click', async () => {
    try {
      const res = await deleteProduct(selectedProductId);

      dom.confirmDeleteModal.classList.add('hidden');
      dom.modal.classList.add('hidden');
      const params = new URLSearchParams(window.location.search);
      const warehouseId = params.get('warehouseId');
      fetchProducts(warehouseId);
      showToast('success', res.data.message);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to delete product');
    }
  });
});
