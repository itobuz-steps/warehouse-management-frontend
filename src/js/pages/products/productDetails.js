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
  handleSaveLimit,
} from './productEvents';
import { productSelection } from './productSelector';
import { getCurrentUser } from '../../common/api/HelperApi';
import {
  managerProductQuantity,
  warehouseProductList,
} from '../../common/template/productTemplate';

let currentImageIndex = 0;
let currentImages = [];
let selectedProductId = null;
let imageTimeout = null;

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

function initializeCarousel(images) {
  currentImages = images;
  currentImageIndex = 0;

  const carouselImage = document.getElementById('carouselImage');
  const carouselDots = document.querySelector('.carousel-dots');

  carouselImage.src = currentImages[currentImageIndex];

  // create the dots dynamically 
  carouselDots.innerHTML = '';
  currentImages.forEach((image, index) => {
    const dot = document.createElement('span');
    dot.dataset.index = index;
    carouselDots.appendChild(dot);

    dot.addEventListener('click', () => {
      clearInterval(imageTimeout);
      currentImageIndex = index;
      updateCarousel();
      startAutoSlide();
    });
  });

  updateCarousel();

  // start the auto-slide
  startAutoSlide();
}

// function to update carousel
function updateCarousel() {
  const carouselImage = document.getElementById('carouselImage');
  const dots = document.querySelectorAll('.carousel-dots span');

  carouselImage.src = currentImages[currentImageIndex];

  // update the active dot
  dots.forEach((dot) => dot.classList.remove('active'));
  dots[currentImageIndex].classList.add('active');
}

function startAutoSlide() {
  imageTimeout = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateCarousel();
  }, 5000);
}

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

  initializeCarousel(currentImages);

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

      productSelection.quantitySection.innerHTML = managerProductQuantity(
        res.data.data[0]
      );
    } else {
      const totalRes = await fetchTotalProductQuantity(productId);

      let totalQty = totalRes.data.data[0].quantity ?? 0;

      const listRes = await fetchProductSpecificWarehouses(productId);

      const quantityList = warehouseProductList(listRes.data.data);

      productSelection.quantitySection.innerHTML = `
        <div class="overview-card mb-2">
          <p class="m-0 p-0"><strong>Total Quantity:</strong> ${totalQty}</p>
        </div>
        <hr/>
        <div class="warehouse-list-container justify-content-evenly px-2">
          ${quantityList}
        </div>
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

  productSelection.limitQuantityId.value = btn.dataset.id;
  productSelection.limitInput.value = btn.dataset.limit;

  const modal = new bootstrap.Modal(productSelection.limitModal);
  modal.show();
});

productSelection.saveLimitBtn.addEventListener('click', handleSaveLimit);

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
