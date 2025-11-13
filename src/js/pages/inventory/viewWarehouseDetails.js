import Templates from '../../common/Templates';
import api from '../../api/interceptor';
import config from '../../config/config';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');
const viewWarehouseName = document.getElementById('viewWarehouseName');
const viewAddress = document.getElementById('viewAddress');
const viewDetails = document.getElementById('viewDetails');
const viewManagers = document.getElementById('viewManagers');

async function viewWarehouseDetails(id) {
  try {
    const getUser = await api.get(`${config.PROFILE_BASE_URL}/me`);
    const userId = getUser.data.data.user._id;

    const warehouseDetails = await api.get(
      `${config.WAREHOUSE_BASE_URL}/get-warehouses/${userId}/${id}`
    );
    const warehouse = warehouseDetails.data.data;

    viewWarehouseName.innerHTML = warehouse.name;
    viewAddress.innerHTML = warehouse.address;
    viewDetails.innerHTML = warehouse.description;

    viewManagers.innerHTML = '';
    warehouse.managerIds.forEach(
      (manager) =>
        (viewManagers.innerHTML += `<div class="manager">${manager.name}</div>`)
    );
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

window.viewWarehouseDetails = viewWarehouseDetails;
