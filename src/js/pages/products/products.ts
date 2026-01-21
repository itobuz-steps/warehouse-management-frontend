import '../../../scss/products.scss';
import { initEvents } from './productEvents.js';
import { initProductLoader } from './productSubscribe.js';

initEvents();
await initProductLoader();
