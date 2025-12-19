const archivedSelection = {
  confirmDeleteModal: document.getElementById('confirmDeleteModal'),
  productModal: document.getElementById('productModal'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  carouselImage: document.getElementById('carouselImage'),
  prevBtn: document.querySelector('.prev'),
  nextBtn: document.querySelector('.next'),

  modalProductName: document.getElementById('modalProductName'),
  modalDescription: document.getElementById('modalDescription'),
  modalPrice: document.getElementById('modalPrice'),
  modalCategory: document.getElementById('modalCategory'),

  restoreBtn: document.getElementById('deleteProductBtn'),
  closeModalBtn: document.querySelector('.close-modal'),
  qrCodeImage: document.querySelector('.qr-code'),

  productGrid: document.getElementById('productGrid'),
  pagination: document.getElementById('pagination'),

  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortSelect: document.getElementById('sortSelect'),
};

export default archivedSelection;
