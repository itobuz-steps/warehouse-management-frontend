import api from '../../api/interceptor.js';
import { config } from '../../config/config.js';
import Choices from 'choices.js';
import Templates from '../../common/Templates.js';
import { displayWarehouse } from './displayWarehouse.js';
import * as bootstrap from 'bootstrap';
import type { User } from '../../types/user.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection') as HTMLDivElement;
const addWarehouseModal = document.getElementById(
  'addWarehouseModal'
) as HTMLDivElement;
const addModalObject = new bootstrap.Modal(addWarehouseModal);

const managerSelect = new Choices('#addManagers', {
  removeItemButton: true,
  searchEnabled: true,
  placeholderValue: 'Search Managers',
  noResultsText: 'No managers found',
});

export const addWarehouseSubscribe = async (event: SubmitEvent) => {
  try {
    event.preventDefault();

    if (!(event.currentTarget instanceof HTMLFormElement)) return;
    // Get form fields
    const form = event.currentTarget;
    const name = (form.querySelector('#name') as HTMLInputElement).value.trim();
    const address = (
      form.querySelector('#address') as HTMLInputElement
    ).value.trim();
    const description = (
      form.querySelector('#description') as HTMLTextAreaElement
    ).value.trim();
    const capacity = (form.querySelector('#capacity') as HTMLInputElement)
      .value;

    // Get selected managers from Choices.js
    const selectedManagers = managerSelect.getValue(true); // returns an array of manager id

    const warehouse = {
      name,
      address,
      description,
      managers: selectedManagers,
      capacity,
    };

    const response = await api.post(
      `${config.ADMIN_BASE_URL}/add-warehouse`,
      warehouse
    );

    displayWarehouse();
    addModalObject.hide();

    toastSection.innerHTML = displayToast.successToast(response.data.message);
  } catch (err) {
    if (err instanceof Error) {
      toastSection.innerHTML = displayToast.errorToast(err.message);
    }
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export const showManagerOptions = async () => {
  try {
    const response = await api.get(`${config.ADMIN_BASE_URL}/get-managers`);

    const managers = response.data.data;

    console.log('managers', managers);
    // Update Choices.js dropdown directly
    managerSelect.clearStore(); // clear previous ones

    managerSelect.setChoices(
      managers.map((manager: User) => ({
        value: manager._id,
        label: manager.name,
        selected: false,
        disabled: false,
      })),
      'value',
      'label',
      false
    );
  } catch (error) {
    if (error instanceof Error) {
      toastSection.innerHTML = displayToast.errorToast(error.message);
    }
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};
