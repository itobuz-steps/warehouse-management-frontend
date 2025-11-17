import '../../../scss/products.scss';
import { loadWarehouses } from './productWarehouse.js';
import { initEvents } from './productEvents.js';
import { initProductSearch } from './productSearch.js';

initEvents();
await loadWarehouses();
await initProductSearch();
