import axios from 'axios';
import config from '../../../config/config.js';
import Choices from 'choices.js';

const managerSelect = new Choices('#managers', {
  removeItemButton: true,
  searchEnabled: true,
  placeholderValue: 'Type or select a skill',
  noResultsText: 'No matching skills found',
});

export const addManagerSubscribe = async (event) => {
  try {
    event.preventDefault();

    const managerFormData = new FormData(event.target);
    const email = managerFormData.get('email');

    const response = await axios.post(`${config.AUTH_BASE_URL}/signup`, {
      email,
    });

    console.log(response);
  } catch (err) {
    console.log(err);
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
      location: address,
      description,
      managers: selectedManagers,
    };

    console.log(warehouse);

    const response = await axios.post(
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
  } catch (err) {
    console.log(err);
  }
};
