import '../../../scss/styles.scss';
import '../../../scss/dashboard.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

import dashboardSelection from './dashboardSelector';
import { addManagerSubscribe } from './adminSubscribe.js';

import { showTopProductsSubscribe, showInventoryCategorySubscribe, showProductTransactionSubscribe } from './dashboardSubscribe.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);


document.addEventListener("DOMContentLoaded", showTopProductsSubscribe );
document.addEventListener("DOMContentLoaded", showInventoryCategorySubscribe );
document.addEventListener("DOMContentLoaded", showProductTransactionSubscribe );
