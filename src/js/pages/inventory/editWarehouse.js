import api from '../../api/interceptor';
import config from '../../config/config';
import Templates from '../../common/Templates.js';
import Choices from 'choices.js';
import { displayWarehouse } from './displayWarehouse.js';
import * as bootstrap from 'bootstrap';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');
const editWarehouseName = document.getElementById('editWarehouseName');
const editWarehouseAddress = document.getElementById('editWarehouseAddress');
const editWarehouseDescription = document.getElementById(
  'editWarehouseDescription'
);
const editWarehouseForm = document.getElementById('editWarehouseForm');
const editWarehouseModal = document.getElementById('editWarehouseModal');
const editModalObject = new bootstrap.Modal(editWarehouseModal);

const managerSelect = new Choices('#editManagers', {
  removeItemButton: true,
  searchEnabled: true,
  placeholderValue: 'Search Managers',
  noResultsText: 'No managers found',
});

export async function updateWarehouse(event) {
  try {
    event.preventDefault();

    const id = editWarehouseForm.getAttribute('data-id');
    const selectedManagers = managerSelect.getValue(true); // returns an array of manager id

    const warehouse = {
      name: editWarehouseName.value,
      address: editWarehouseAddress.value,
      description: editWarehouseDescription.value,
      managers: selectedManagers,
    };

    const response = await api.post(
      `${config.ADMIN_BASE_URL}/update-warehouse/${id}`,
      warehouse
    );

    editModalObject.hide();
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

export const selectedManagerOptions = async (selectedManagers) => {
  try {
    const response = await api.get(`${config.ADMIN_BASE_URL}/get-managers`);
    const managers = response.data.data;
    const selectedIds = selectedManagers.map((m) => m._id);

    managerSelect.clearStore(); // clear previous ones

    managerSelect.setChoices(
      managers.map((manager) => ({
        value: manager._id,
        label: manager.name,
        selected: selectedIds.includes(manager._id),
        disabled: false,
      })),
      'value',
      'label',
      false
    );

    console.log(response.data.message);
  } catch (error) {
    toastSection.innerHTML = displayToast.errorToast(error.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};
