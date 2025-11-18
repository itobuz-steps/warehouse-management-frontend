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

const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

cancelDeleteBtn.addEventListener('click', () => {
  confirmDeleteModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === confirmDeleteModal) {
    confirmDeleteModal.classList.add('hidden');
  }
});

export const openProductModal = async (product) => {
  selectedProductId = product._id;

  currentImages = product.productImage?.length
    ? product.productImage
    : ['/images/placeholder.png'];

  currentImageIndex = 0;
  dom.carouselImg.src = currentImages[0];

  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalDescription').textContent =
    product.description || 'No description available.';
  document.getElementById('modalPrice').textContent = product.price ?? 'N/A';
  document.getElementById('modalCategory').textContent =
    product.category ?? 'Not Categorized';

  await loadQuantityInfo(selectedProductId);

  dom.modal.classList.remove('hidden');
};

document.querySelector('.prev').addEventListener('click', () => {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  dom.carouselImg.src = currentImages[currentImageIndex];
});

document.querySelector('.next').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  dom.carouselImg.src = currentImages[currentImageIndex];
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

      const qty = res.data.data[0].quantity;
      quantitySection.innerHTML = `
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

const editModal = document.getElementById('editProductModal');
const closeEditModal = document.querySelector('.close-edit-modal');

document.getElementById('editProductBtn').addEventListener('click', () => {
  document.getElementById('editName').value =
    document.getElementById('modalProductName').textContent;
  document.getElementById('editDescription').value =
    document.getElementById('modalDescription').textContent;
  document.getElementById('editCategory').value =
    document.getElementById('modalCategory').textContent;
  document.getElementById('editPrice').value =
    document.getElementById('modalPrice').textContent;

  editModal.classList.remove('hidden');
});

closeEditModal.addEventListener('click', () =>
  editModal.classList.add('hidden')
);

window.addEventListener('click', (e) => {
  if (e.target === editModal) editModal.classList.add('hidden');
});

document
  .getElementById('editProductForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('editName').value);
    formData.append(
      'description',
      document.getElementById('editDescription').value
    );
    formData.append('category', document.getElementById('editCategory').value);
    formData.append('price', document.getElementById('editPrice').value);

    const files = document.getElementById('editImages').files;
    for (let i = 0; i < files.length; i++) {
      formData.append('productImage', files[i]);
    }

    try {
      const res = await editProduct(formData, selectedProductId);
      // console.log(res);
      editModal.classList.add('hidden');
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

document
  .getElementById('deleteProductBtn')
  .addEventListener('click', async () => {
    document
      .getElementById('deleteProductBtn')
      .addEventListener('click', () => {
        document
          .getElementById('confirmDeleteModal')
          .classList.remove('hidden');
      });

    confirmDeleteBtn.addEventListener('click', async () => {
      try {
        const res = await deleteProduct(selectedProductId);

        confirmDeleteModal.classList.add('hidden');
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
