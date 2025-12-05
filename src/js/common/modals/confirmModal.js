import * as bootstrap from 'bootstrap';

export function confirmModal(message = 'Are you sure?') {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('confirmTransactionModal');
    const messageEl = document.getElementById('confirmModalMessage');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const proceedBtn = document.getElementById('confirmProceedBtn');

    messageEl.textContent = message;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const clean = () => {
      cancelBtn.removeEventListener('click', onCancel);
      proceedBtn.removeEventListener('click', onProceed);
    };

    const onCancel = () => {
      clean();
      modal.hide();
      resolve(false);
    };

    const onProceed = () => {
      clean();
      modal.hide();
      resolve(true);
    };

    cancelBtn.addEventListener('click', onCancel);
    proceedBtn.addEventListener('click', onProceed);
  });
}
