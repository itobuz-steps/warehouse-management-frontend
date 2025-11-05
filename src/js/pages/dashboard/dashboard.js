import '../../../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import dashboardSelection from './dashboardSelector';
import {
  addManagerSubscribe,
  addWarehouseSubscribe,
} from './adminSubscribe.js';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);

dashboardSelection.addWarehouseForm.addEventListener(
  'submit',
  addWarehouseSubscribe
);
