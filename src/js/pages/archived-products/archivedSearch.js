import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import { renderPaginatedArchived } from './archivedSubscribe.js';

let searchQuery = '';
let selectedCategory = '';
let selectedSort = '';

export const initArchivedSearch = () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    fetchArchivedSearch();
  });

  categoryFilter.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    fetchArchivedSearch();
  });

  sortSelect.addEventListener('change', (e) => {
    selectedSort = e.target.value;
    fetchArchivedSearch();
  });
};

export const fetchArchivedSearch = async () => {
  try {
    const response = await api.get(`${config.PRODUCT_BASE_URL}/archived/all`, {
      params: {
        search: searchQuery,
        category: selectedCategory,
        sort: selectedSort,
      },
    });

    const products = response.data.data || [];

    // Reset pagination
    window.currentPage = 1;

    renderPaginatedArchived(products);
  } catch (err) {
    console.error('Search Error:', err);
    renderPaginatedArchived([]);
  }
};
