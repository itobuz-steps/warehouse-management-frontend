import axios from 'axios';
import config from '../../../config/config.js';

const addManagerSubscribe = async (event) => {
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

export default addManagerSubscribe;
