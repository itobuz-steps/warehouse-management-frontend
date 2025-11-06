import '../../../scss/styles.scss';
import '../../../scss/dashboard.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import dashboardSelection from './dashboardSelector';
import {
  addManagerSubscribe,
  addWarehouseSubscribe,
  showManagerOptions,
} from './adminSubscribe.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);

dashboardSelection.addWarehouseForm.addEventListener(
  'submit',
  addWarehouseSubscribe
);

// Get all managers when Add-Warehouse button triggered
dashboardSelection.addWarehouseButton.addEventListener(
  'click',
  showManagerOptions
);
