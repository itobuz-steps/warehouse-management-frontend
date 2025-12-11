import '../../../scss/products.scss';
import { loadArchivedProducts } from './archivedSubscribe.js';
import { initArchivedEvents } from './archivedEvents.js';

initArchivedEvents();
await loadArchivedProducts();

