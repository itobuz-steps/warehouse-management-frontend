import signupSelection from './signupSelector.js';
import signupSubscribe from './signupSubscribe.js';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

signupSelection.signupForm.addEventListener('submit', signupSubscribe);

export default token;
