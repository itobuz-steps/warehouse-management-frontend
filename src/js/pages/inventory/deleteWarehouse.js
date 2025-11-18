import Templates from '../../common/Templates';
import api from '../../api/interceptor';
import config from '../../config/config';
import { displayWarehouse } from './displayWarehouse.js';
import * as bootstrap from 'bootstrap';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');
const deleteWarehouseBtn = document.getElementById('deleteWarehouseBtn');
const deleteWarehouseModal = document.getElementById('deleteWarehouseModal');
const deleteModalObject = new bootstrap.Modal(deleteWarehouseModal);

export async function confirmDelete() {
  try {
    const id = deleteWarehouseBtn.getAttribute('data-id');
    const response = await api.post(
      `${config.ADMIN_BASE_URL}/remove-warehouse/${id}`
    );

    deleteModalObject.hide();
    displayWarehouse();
    toastSection.innerHTML = displayToast.successToast(response.data.message);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}
