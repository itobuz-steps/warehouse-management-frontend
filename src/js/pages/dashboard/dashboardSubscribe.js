import api from '../../api/interceptor.js';
import Templates from '../../common/Templates.js';
import dashboardSelection from './dashboardSelector.js';
import config from '../../config/config.js';
import {
  getCurrentUser,
  getUserWarehouses,
} from '../../common/api/helperApi.js';

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
    if (!warehouseId) {
      dashboardSelection.chartCard.style.display = 'none';
      return;
    }

    //passing the id as query param.
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-top-products/${warehouseId}`
    );

    const products = res.data.data;

    const labels = products.map((item) => item.productName);
    const quantities = products.map((item) => item.totalQuantity);

    if (barGraph) {
      barGraph.destroy();
    }

    dashboardSelection.topFiveExport.setAttribute(
      'data-json',
      JSON.stringify(products)
    );

    barGraph = new Chart(dashboardSelection.barGraph, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: quantities,
            label: 'Quantity',
            backgroundColor: [
              '#00A6A6',
              '#0077B6',
              '#FF6B6B',
              '#FFD166',
              '#06D6A0',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

  const labels = res.data.data.map((item) => item._id);
  const quantities = res.data.data.map((item) => item.totalProducts);

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
            '#66c59dff',
            '#376dc0ff',
            '#009494',
            '#536a6aff',
            '#0077B6',
            '#48CAE4',
            '#FFD166',
            '#FF6B6B',
            '#06D6A0',
            '#8338EC',
            '#FF9F1C',
            '#F72585',
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
};

const showProductTransactionSubscribe = async (warehouseId) => {
  try {
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-product-transaction/${warehouseId}`
    );

    const transactionDetails = res.data.data;

    const labels = transactionDetails.map((d) => d._id);
    const IN = transactionDetails.map((d) => d.IN);
    const OUT = transactionDetails.map((d) => d.OUT);

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
            borderColor: '#00A6A6',
            backgroundColor: '#00A6A6',
          },
          {
            label: 'Stock Out',
            data: OUT,
            borderWidth: 2,
            fill: false,
            borderColor: '#FF6B6B',
            backgroundColor: '#FF6B6B',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
              stepSize: 1,
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

    dashboardSelection.salesInput.innerText = `₹${totalSales.toLocaleString('hi-IN')}`;
    dashboardSelection.saleQuantity.innerText = `Units sold: ${saleQuantity.toLocaleString('hi-IN')}`;
    dashboardSelection.purchaseInput.innerText = `₹${totalPurchase.toLocaleString('hi-IN')}`;
    dashboardSelection.purchaseQuantity.innerText = `Units purchased: ${purchaseQuantity.toLocaleString('hi-IN')}`;
    dashboardSelection.inventoryInput.innerText = `${totalInventory.toLocaleString('hi-IN')} items left`;
    dashboardSelection.shipmentInput.innerText = `${todayShipment.toLocaleString('hi-IN')}`;
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

    if (!items.length) {
      dashboardSelection.tableCard.style.display = 'none';
    } else {
      dashboardSelection.tableCard.style.display = 'block';

      items.forEach((item) => {
        const row = `
      <tr>
        <td>${item.productName}</td>
        <td>${item.quantity} units</td>
        <td>
          <span class="badge">Low</span>
        </td>
      </tr>`;

        dashboardSelection.lowStockTable.innerHTML += row;
      });
    }
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

const noWarehouseDisplay = () => {
  //no warehouse so remove the statistics charts.
  dashboardSelection.warehouseSelect.style.display = 'none';
  dashboardSelection.tableCard.style.display = 'none';
  dashboardSelection.noDashboardBox.style.display = 'flex';
  dashboardSelection.noDashboardBox.innerHTML =
    '<p>No warehouse assigned yet! wait for the admin to assign warehouse or contact admin.</p>';

  dashboardSelection.chartCard.forEach((chart) => {
    chart.style.display = 'none';
  });
};

const warehouseDisplay = () => {
  dashboardSelection.noDashboardBox.style.display = 'none';
};

const showRecentTransactions = async (warehouseId) => {
  try {
    if (!warehouseId) return;

    const res = await api.get(
      `${config.TRANSACTION_BASE_URL}/warehouse-specific-transaction/${warehouseId}?page=1&limit=10`
    );

    const transactions = res.data.data.transactions || [];

    dashboardSelection.recentActivityList.innerHTML = '';

    if (!transactions.length) {
      dashboardSelection.recentActivityList.innerHTML =
        '<p class="text-muted">No recent activity</p>';
      return;
    }

    transactions.forEach((tx) => {
      const productName = tx.product?.productName || tx.product?.name || 'Item';
      const qty = tx.quantity ?? tx.qty ?? 0;
      const performedBy =
        tx.performedBy?.name || tx.performedBy?.fullName || 'System';
      const type = tx.type || tx._doc?.type || 'UNKNOWN';
      const updatedAt = tx.updatedAt || tx.createdAt;
      const time = updatedAt ? new Date(updatedAt).toLocaleString() : '';

      let dotClass = 'info';
      if (type === 'IN') dotClass = 'success';
      else if (type === 'OUT') dotClass = 'info';
      else if (type === 'TRANSFER') dotClass = 'warning';
      else if (type === 'ADJUSTMENT' || type === 'ADJ') dotClass = 'danger';

      const targetWarehouse =
        tx.destinationWarehouse?.name || tx.sourceWarehouse?.name || '';

      const actionText =
        type === 'IN'
          ? `Stock In of <strong>${productName}</strong> (${qty} units)`
          : type === 'OUT'
            ? `Stock Out of <strong>${productName}</strong> (${qty} units)`
            : type === 'TRANSFER'
              ? `Transfer <strong>${productName}</strong> (${qty} units) to ${targetWarehouse}`
              : type === 'ADJUSTMENT' 
                  ? `Adjustment made on <strong>${productName}</strong> (${qty} units)`
                : `<strong>${productName}</strong> (${qty} units)`;

      const item = `
      <div class="activity-item">
        <span class="dot ${dotClass}"></span>
        <div>
          <p><strong>${performedBy}</strong> · ${actionText}</p>
          <small>${time}</small>
        </div>
      </div>
      `;

      dashboardSelection.recentActivityList.innerHTML += item;
    });
  } catch (err) {
    dashboardSelection.recentActivityList.innerHTML =
      '<p class="text-danger">Unable to load recent activity</p>';
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
    const warehouses = await getUserWarehouses();

    if (user.role === 'manager') {
      dashboardSelection.addManagerButton.remove();
    }

    if (!warehouses.length) {
      noWarehouseDisplay();
      return false;
    }

    warehouseDisplay();
    warehouseSelect.innerHTML = '';
    warehouseSelect.innerHTML = `<option value="${warehouses[0]._id}" selected>${warehouses[0].name}</option>`;

    warehouses.slice(1).forEach((warehouse) => {
      const option = document.createElement('option');
      option.value = warehouse._id;
      option.textContent = warehouse.name;

      warehouseSelect.appendChild(option);
    });

    return true;
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

async function showTopSellingProductsSubscribe(warehouseId) {
  try {
    if (!warehouseId) {
      dashboardSelection.chartCard.style.display = 'none';
      return;
    }
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-top-selling-products/${warehouseId}`
    );

    const products = res.data.data;

    const carouselItemsContainer = document.getElementById('carouselItems');
    
    carouselItemsContainer.innerHTML = '';

    products.forEach((product, index) => {
      const isActive = index === 0 ? 'active' : ''; 

      const itemHTML = `
        <div class="carousel-item ${isActive}">
          <img src="${product.productImage}" class="d-block w-100" alt="${product.productName}">
          <div class="carousel-caption d-none d-md-block">
            <h5>${product.productName}</h5>
            <p>Sold: ${product.totalSoldQuantity} units</p>
            <p>₹${product.totalSalesAmount.toLocaleString('hi-IN')}</p>
          </div>
        </div>
      `;

      carouselItemsContainer.innerHTML += itemHTML; 
    });
  } catch (err) {
    toastSection.innerHTML = displayToast.errorToast(err.message);

    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
}


export {
  showTopProductsSubscribe,
  showInventoryCategorySubscribe,
  showProductTransactionSubscribe,
  fetchUserAndWarehouses,
  showTransactionStatsSubscribe,
  showLowStockProducts,
  showRecentTransactions,
  showTopSellingProductsSubscribe,
};
