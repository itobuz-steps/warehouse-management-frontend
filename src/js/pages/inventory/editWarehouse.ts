import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import Templates from '../../common/Templates.js';
import Choices from 'choices.js';
import { displayWarehouse } from './displayWarehouse.js';
import * as bootstrap from 'bootstrap';
import inventorySelection from './inventorySelector.js';
import type { User } from '../../types/user.js';

const displayToast = new Templates();
const editModalObject = new bootstrap.Modal(
  inventorySelection.editWarehouseModal
);

const managerSelect = new Choices('#editManagers', {
  removeItemButton: true,
  searchEnabled: true,
  placeholderValue: 'Search Managers',
  noResultsText: 'No managers found',
});

export async function updateWarehouse(event: SubmitEvent) {
  try {
    event.preventDefault();

    const id = inventorySelection.editWarehouseForm.getAttribute('data-id');
    const selectedManagers = managerSelect.getValue(true); // returns an array of manager id

    const warehouse = {
      name: inventorySelection.editWarehouseName.value,
      address: inventorySelection.editWarehouseAddress.value,
      description: inventorySelection.editWarehouseDescription.value,
      managers: selectedManagers,
    };

    const response = await api.post(
      `${config.ADMIN_BASE_URL}/update-warehouse/${id}`,
      warehouse
    );

    editModalObject.hide();
    displayWarehouse();

    inventorySelection.toastSection.innerHTML = displayToast.successToast(
      response.data.message
    );
  } catch (err) {
    if (err instanceof Error) {
      inventorySelection.toastSection.innerHTML = displayToast.errorToast(
        err.message
      );
    }
  } finally {
    setTimeout(() => {
      inventorySelection.toastSection.innerHTML = '';
    }, 3000);
  }
}

export const selectedManagerOptions = async (selectedManagers: User[]) => {
  try {
    const response = await api.get(`${config.ADMIN_BASE_URL}/get-managers`);
    const managers = response.data.data;
    const selectedIds = selectedManagers.map((m) => m._id);

    managerSelect.clearStore(); // clear previous ones

    managerSelect.setChoices(
      managers.map((manager: User) => ({
        value: manager._id,
        label: manager.name,
        selected: selectedIds.includes(manager._id),
        disabled: false,
      })),
      'value',
      'label',
      false
    );
  } catch (error) {
    if (error instanceof Error) {
      inventorySelection.toastSection.innerHTML = displayToast.errorToast(
        error.message
      );
    }
  } finally {
    setTimeout(() => {
      inventorySelection.toastSection.innerHTML = '';
    }, 3000);
  }
};
