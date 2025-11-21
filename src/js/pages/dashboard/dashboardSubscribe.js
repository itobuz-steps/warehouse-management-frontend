import api from '../../api/interceptor.js';
import Templates from '../../common/Templates.js';
import dashboardSelection from './dashboardSelector.js';
import config from '../../config/config.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../products/productApiHelper.js';

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement
);

const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

let barGraph = null;

async function showTopProductsSubscribe(warehouseId) {
  try {
    //passing the id as query param.
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-top-products/${warehouseId}`
    );
    const products = res.data.topProducts;

    const labels = products.map((item) => item.productName);
    const quantities = products.map((item) => item.totalQuantity);

    if (barGraph) {
      barGraph.destroy();
    }

    barGraph = new Chart(dashboardSelection.barGraph, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Top 5 Stocked Products',
            data: quantities,
            backgroundColor: [
              '#ef476f',
              '#ffd166',
              '#06d6a0',
              '#118ab2',
              '#073b4c',
            ],
          },
        ],
      },
      options: { responsive: true },
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}

const showInventoryCategorySubscribe = async (warehouseId) => {
  const res = await api.get(
    `${config.DASHBOARD_BASE_URL}/get-inventory-category/${warehouseId}`
  );

  const labels = res.data.productsCategory.map((item) => item._id);
  const quantities = res.data.productsCategory.map(
    (item) => item.totalProducts
  );

  new Chart(dashboardSelection.pieChart, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          label: 'Products categories',
          data: quantities,
          backgroundColor: [
            '#a26074',
            '#b87c92',
            '#a26074',
            '#864a5b',
            '#864a5b',
            '#613a45',
            '#391e25',
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: { responsive: true },
  });
};

const showProductTransactionSubscribe = async (warehouseId) => {
  try {
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-product-transaction/${warehouseId}`
    );

    const transactionDetail = res.data.transactionDetail;

    const labels = transactionDetail.map((d) => d._id);
    const IN = transactionDetail.map((d) => d.IN);
    const OUT = transactionDetail.map((d) => d.OUT);

    new Chart(dashboardSelection.lineChart, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'IN',
            data: IN,
            borderWidth: 2,
            fill: false,
            borderColor: '#a26074',
            backgroundColor: '#a26074',
          },
          {
            label: 'OUT',
            data: OUT,
            borderWidth: 2,
            fill: false,
            borderColor: '#613a45',
            backgroundColor: 'rgba(255, 82, 82, 0.3)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Last 7 Days (Daily)' } },
      },
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

const showTransactionStatsSubscribe = async (warehouseId) => {
  try {
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-transaction-stats/${warehouseId}`
    );
    console.log(res);

    const data = res.data.data;
    console.log(data);

    const totalSales = data.sales.totalSales;
    const totalPurchase = data.purchase.totalPurchase;
    const purchaseQuantity = data.purchase.purchaseQuantity;
    const totalInventory = data.inventory.totalQuantity;
    
    dashboardSelection.salesInput.innerText = `₹${totalSales}`;
    dashboardSelection.purchaseQuantity.innerText = `${purchaseQuantity} purchases`;
    dashboardSelection.purchaseInput.innerText = totalPurchase;
    dashboardSelection.inventoryInput.innerText = totalInventory;

  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

const fetchUserAndWarehouses = async (warehouseSelect) => {
  try {
    //fetching user details.
    const user = await getCurrentUser();
    const warehouses = await getUserWarehouses(user._id);

    warehouseSelect.innerHTML = '';
    warehouseSelect.innerHTML = `<option value="${warehouses[0]._id}" selected>${warehouses[0].name}</option>`;

    warehouses.slice(1).forEach((warehouse) => {
      const option = document.createElement('option');
      option.value = warehouse._id;
      option.textContent = warehouse.name;
      warehouseSelect.appendChild(option);
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export {
  showTopProductsSubscribe,
  showInventoryCategorySubscribe,
  showProductTransactionSubscribe,
  fetchUserAndWarehouses,
  showTransactionStatsSubscribe,
};
