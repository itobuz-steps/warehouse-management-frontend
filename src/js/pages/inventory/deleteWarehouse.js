import Templates from '../../common/Templates';
import api from '../../api/interceptor';
import config from '../../config/config';
import { displayWarehouse } from './displayWarehouse.js';
import * as bootstrap from 'bootstrap';
import inventorySelection from './inventorySelector.js';

const displayToast = new Templates();
// const toastSection = document.getElementById('toastSection');
// const deleteWarehouseBtn = document.getElementById('deleteWarehouseBtn');
// const deleteWarehouseModal = document.getElementById('deleteWarehouseModal');
const deleteModalObject = new bootstrap.Modal(
  inventorySelection.deleteWarehouseModal
);

export async function confirmDelete() {
  try {
    const id = inventorySelection.deleteWarehouseBtn.getAttribute('data-id');
    const response = await api.post(
      `${config.ADMIN_BASE_URL}/remove-warehouse/${id}`
    );

    deleteModalObject.hide();
    displayWarehouse();
    inventorySelection.toastSection.innerHTML = displayToast.successToast(
      response.data.message
    );
  } catch (err) {
    inventorySelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
  } finally {
    setTimeout(() => {
      inventorySelection.toastSection.innerHTML = '';
    }, 3000);
  }
}
