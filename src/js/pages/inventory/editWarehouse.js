import api from '../../api/interceptor';
import config from '../../config/config';
import Templates from '../../common/Templates.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');
const editWarehouseName = document.getElementById('editWarehouseName');
const editWarehouseAddress = document.getElementById('editWarehouseAddress');
const editWarehouseDescription = document.getElementById(
  'editWarehouseDescription'
);
const editWarehouseForm = document.getElementById('editWarehouseForm');

export async function updateWarehouse() {
  try {
    const id = editWarehouseForm.getAttribute('data-id');
    console.log(id);

    // toastSection.innerHTML = displayToast.successToast(response.data.message);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}
