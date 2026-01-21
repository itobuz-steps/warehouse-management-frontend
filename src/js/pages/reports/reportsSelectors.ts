const reportSelection = {
  reportSection: document.querySelector(
    '.transaction-reports'
  ) as HTMLDivElement,
  warehouseDropdown: document.querySelector('.warehouses-options'),
  dropdownBtn: document.querySelector(
    '.warehouse-dropdown'
  ) as HTMLButtonElement,

  dateFilter: document.getElementById('applyDateFilter') as HTMLButtonElement,
  startDate: document.getElementById('startDate') as HTMLInputElement,
  endDate: document.getElementById('endDate') as HTMLInputElement,
};

export default reportSelection;
