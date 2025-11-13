import api from '../../api/interceptor';
import config from '../../config/config';
import Choices from 'choices.js';
import Templates from '../../common/Templates.js';

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

const managerSelect = new Choices('#addManagers', {
  removeItemButton: true,
  searchEnabled: true,
  placeholderValue: 'Search Managers',
  noResultsText: 'No managers found',
});

export const addWarehouseSubscribe = async (event) => {
  try {
    event.preventDefault();

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

    console.log(selectedManagers);

    const response = await api.post(
      `${config.ADMIN_BASE_URL}/add-warehouse`,
      warehouse
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
  try {
    const response = await api.get(`${config.ADMIN_BASE_URL}/get-managers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const managers = response.data.data;

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

    console.log(response.data.message);
  } catch (error) {
    toastSection.innerHTML = displayToast.errorToast(error);
  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};
