import config from '../../../config/config';
import axios from 'axios';
import token from './signup';

const signupSubscribe = async (event) => {
  try {
    event.preventDefault();

    const signupFormData = new FormData(event.target);
    const name = signupFormData.get('name');
    const password = signupFormData.get('password');
    const signupData = { name, password };

    const response = await axios.post(
      `${config.AUTH_BASE_URL}/signup/${token}`,
      signupData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response);
    window.location.href = '/pages/login.html';
  } catch (err) {
    console.log(err);
  }
};

export default signupSubscribe;
