import api from '../../api/interceptor.js';
import config from '../../config/config.js';
import Choices from 'choices.js';
import Templates from '../../common/Templates.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

const managerSelect = new Choices('#managers', {
  removeItemButton: true,
  searchEnabled: true,
  placeholderValue: 'Search Managers',
  noResultsText: 'No managers found',
});

export const addManagerSubscribe = async (event) => {
  try {
    event.preventDefault();

    const managerFormData = new FormData(event.target);
    const email = managerFormData.get('email');

    const response = await api.post(`${config.AUTH_BASE_URL}/signup`, {
      email,
    });

    console.log(response);
    toastSection.innerHTML = displayToast.successToast(response.data.message);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.response.data.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export const addWarehouseSubscribe = async (event) => {
  try {
    event.preventDefault();
    console.log('Adding Warehouse...');

    // Get form fields
    const form = event.target;
    const name = form.querySelector('#name').value.trim();
    const address = form.querySelector('#address').value.trim();
    const description = form.querySelector('#description').value.trim();

    // Get selected managers from Choices.js
    const selectedManagers = managerSelect.getValue(true); // returns an array of manager id

    const warehouse = {
      name,
      address,
      description,
      managers: selectedManagers,
    };

    console.log(warehouse);

    const response = await api.post(
      `${config.ADMIN_BASE_URL}/add-warehouse`,
      warehouse,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    console.log(response);
    toastSection.innerHTML = displayToast.successToast(response.data.message);
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.response.data.message);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export const showManagerOptions = async () => {
  console.log('Add Warehouse');

  try {
    const response = await api.get(`${config.ADMIN_BASE_URL}/get-managers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const managers = response.data.managers;
    console.log('Fetched managers:', managers);

    // Update Choices.js dropdown directly
    managerSelect.clearChoices(); // clear previous ones

    managerSelect.setChoices(
      managers.map((manager) => ({
        value: manager._id,
        label: manager.name,
        selected: false,
        disabled: false,
      })),
      'value',
      'label',
      false
    );

    console.log('Manager options updated in Choices.js');
  } catch (error) {
    console.error('Error fetching managers:', error);
  }
};
