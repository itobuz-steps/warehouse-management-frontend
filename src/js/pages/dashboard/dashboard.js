import '../../../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import dashboardSelection from './dashboardSelector';
import addManagerSubscribe from './addManagerSubscribe';

dashboardSelection.addManagerForm.addEventListener(
  'submit',
  addManagerSubscribe
);
