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
let doughnut = null;
let lineGraph = null;

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
            data: quantities,
            label: 'Quantity',
            backgroundColor: [
              '#780116',
              '#ffd166',
              '#005c00',
              '#00a5cf',
              '#003049',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Products',
              color: '#2a030eff',
              font: {
                size: 15,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantity',
              color: '#2a030eff',
              font: {
                size: 15,
              },
            },
            beginAtZero: true,
          },
        },
      },
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

  if (doughnut) {
    doughnut.destroy();
  }

  doughnut = new Chart(dashboardSelection.pieChart, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          label: 'Quantity',
          data: quantities,
          backgroundColor: [
            '#780116',
            '#f7b538',
            '#11151c',
            '#005c00',
            '#00a5cf',
            '#441151',
            '#c1121f',
            '#ff4000',
            '#60463b',
            '#003049',
            '#bc6c25',
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

    if (lineGraph) {
      lineGraph.destroy();
    }

    lineGraph = new Chart(dashboardSelection.lineChart, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Stock In',
            data: IN,
            borderWidth: 2,
            fill: false,
            borderColor: '#0077b6',
            backgroundColor: '#0077b6',
          },
          {
            label: 'Stock out',
            data: OUT,
            borderWidth: 2,
            fill: false,
            borderColor: '#c1121f',
            backgroundColor: '#c1121f',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Last 7 Days (Daily)' } },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Last 7 Days',
              color: '#864a5b',
              font: {
                size: 15,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Transactions',
              color: '#864a5b',
              font: {
                size: 15,
              },
            },
            ticks: {
              stepSize: 1, // fixed tick interval
            },

            beginAtZero: true,
          },
        },
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

    const data = res.data.data;
    console.log(data);

    let totalSales = 0;
    let saleQuantity = 0;
    let totalPurchase = 0;
    let purchaseQuantity = 0;
    let totalInventory = 0;
    let todayShipment = 0;

    if (data.sales) {
      totalSales = data.sales.totalSales || 0;
      saleQuantity = data.sales.saleQuantity || 0;
    }
    if (data.purchase) {
      totalPurchase = data.purchase.totalPurchase || 0;
      purchaseQuantity = data.purchase.purchaseQuantity || 0;
    }
    if (data.inventory) {
      totalInventory = data.inventory.totalQuantity || 0;
    }
    if (data.todayShipment) {
      todayShipment = data.todayShipment.quantity || 0;
    }

    dashboardSelection.salesInput.innerText = `₹${totalSales.toLocaleString("hi-IN")}`;
    dashboardSelection.saleQuantity.innerText = `Units sold: ${saleQuantity.toLocaleString("hi-IN")}`;
    dashboardSelection.purchaseInput.innerText = `₹${totalPurchase.toLocaleString("hi-IN")}`;
    dashboardSelection.purchaseQuantity.innerText = `Units purchased: ${purchaseQuantity.toLocaleString("hi-IN")}`;
    dashboardSelection.inventoryInput.innerText = `${totalInventory.toLocaleString("hi-IN")} items left`;
    dashboardSelection.shipmentInput.innerText = `${todayShipment.toLocaleString("hi-IN")}`;
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

    dashboardSelection.username.innerText = user.name;

  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

const showLowStockProducts = async (warehouseId) => {
  try {
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-low-stock-products/${warehouseId}`
    );
    const items = res.data.data.lowStockProducts;
    dashboardSelection.lowStockTable.innerHTML = '';

    if(items.length === 0){
      console.log(dashboardSelection.lowStock);
      dashboardSelection.tableCard.style.display = "none";
    }

    items.forEach((item) => {
      const row = `
    <tr>
      <td>${item.productName}</td>
      <td>${item.quantity} units</td>
      <td>
        <span class="badge bg-danger">Low</span>
      </td>
    </tr>`;

      dashboardSelection.lowStockTable.innerHTML += row;
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
  showLowStockProducts,
};
