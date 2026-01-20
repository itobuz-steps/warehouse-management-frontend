const archivedSelection = {
  confirmDeleteModal: document.getElementById(
    'confirmDeleteModal'
  ) as HTMLDivElement,
  productModal: document.getElementById('productModal') as HTMLDivElement,
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  carouselImage: document.getElementById('carouselImage'),
  prevBtn: document.querySelector('.prev'),
  nextBtn: document.querySelector('.next'),

  modalProductName: document.getElementById(
    'modalProductName'
  ) as HTMLHeadingElement,
  modalDescription: document.getElementById(
    'modalDescription'
  ) as HTMLParagraphElement,
  modalPrice: document.getElementById('modalPrice') as HTMLSpanElement,
  modalCategory: document.getElementById('modalCategory') as HTMLSpanElement,
  modalMarkup: document.getElementById('modalMarkup') as HTMLSpanElement,
  modalMarkupPrice: document.getElementById(
    'modalMarkupPrice'
  ) as HTMLSpanElement,

  restoreBtn: document.getElementById('deleteProductBtn') as HTMLButtonElement,
  closeModalBtn: document.querySelector('.close-modal') as HTMLButtonElement,
  qrCodeImage: document.querySelector('.qr-code') as HTMLImageElement,

  productGrid: document.getElementById('productGrid'),
  pagination: document.getElementById('pagination'),

  searchInput: document.getElementById('searchInput') as HTMLInputElement,
  categoryFilter: document.getElementById('categoryFilter'),
  sortSelect: document.getElementById('sortSelect'),
};

export default archivedSelection;
