import '../../../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import dashboardSelection from './dashboardSelector';
import {
  addManagerSubscribe,
  addWarehouseSubscribe,
} from './adminSubscribe.js';
import axios from 'axios';
import config from '../../../config/config.js';

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
  async (event) => {
    event.preventDefault();
    console.log('Add Warehouse');

    const response = await axios.get(`${config.ADMIN_BASE_URL}/get-managers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    console.log(response);
  }
);
