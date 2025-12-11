import '../../../scss/products.scss';
import { loadArchivedProducts } from './archivedSubscribe.js';
import { initArchivedEvents } from './archivedEvents.js';
import { initArchivedSearch } from './archivedSearch.js';

initArchivedEvents();
await loadArchivedProducts();
initArchivedSearch();
