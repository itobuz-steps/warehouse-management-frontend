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
              color: '#015453',
              font: {
                size: 15,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantity',
              color: '#015453',
              font: {
                size: 15,
              },
            },
            beginAtZero: true,
          },
        },
        onClick: (evt, elements) => {
          if (!elements.length) {
            return;
          }

          window.location.href = `/pages/products.html?filter=warehouses&warehouseId=${warehouseId}`;
        },
      },
    });
  } catch (err) {
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
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
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (evt, elements) => {
        if (!elements.length) {
          return;
        }

        window.location.href = `/pages/products.html?filter=warehouses&warehouseId=${warehouseId}`;
      },
    },
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
              color: '#015453',
              font: {
                size: 15,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Transactions',
              color: '#015453',
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
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
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
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
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
      dashboardSelection.lowStockTableCard.style.display = 'none';
      return;
    }

    dashboardSelection.lowStockTableCard.style.display = 'block';

    items.forEach((item) => {
      const rowHTML = displayToast.lowStockRow(item);

      const temp = document.createElement('tbody');
      temp.innerHTML = rowHTML;
      const row = temp.firstElementChild;

      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `/pages/products.html?filter=warehouses&warehouseId=${warehouseId}&productId=${item.productId}`;
      });

      dashboardSelection.lowStockTable.appendChild(row);
    });
  } catch (err) {
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};

// Cancelled Products
const loadMostCancelledProducts = async (warehouseId, limit = 5) => {
  try {
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-cancelled-orders/${warehouseId}?limit=${limit}`
    );

    console.log(res);

    const items = res.data.data;
    dashboardSelection.cancelledTable.innerHTML = '';

    if (!items.length) {
      dashboardSelection.cancelledTableCard.style.display = 'none';
      return;
    }

    dashboardSelection.cancelledTableCard.style.display = 'block';

    items.forEach((item) => {
      const rowHTML = displayToast.cancelledShipmentRow(item);

      const temp = document.createElement('tbody');
      temp.innerHTML = rowHTML;
      const row = temp.firstElementChild;

      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `/pages/products.html?filter=warehouses&warehouseId=${warehouseId}&productId=${item.productId}`;
      });

      dashboardSelection.cancelledTable.appendChild(row);
    });
  } catch (err) {
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};

// Adjusted Products
const loadMostAdjustedProducts = async (warehouseId, limit = 5) => {
  try {
    const res = await api.get(
      `${config.DASHBOARD_BASE_URL}/get-most-adjusted-products/${warehouseId}?limit=${limit}`
    );

    const items = res.data.data;
    dashboardSelection.adjustmentTable.innerHTML = '';

    if (!items.length) {
      dashboardSelection.adjustmentTableCard.style.display = 'none';
      return;
    }

    dashboardSelection.adjustmentTableCard.style.display = 'block';

    items.forEach((item) => {
      const rowHTML = displayToast.adjustmentProductsRow(item);

      const temp = document.createElement('tbody');
      temp.innerHTML = rowHTML;
      const row = temp.firstElementChild;

      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `/pages/products.html?filter=warehouses&warehouseId=${warehouseId}&productId=${item.productId}`;
      });

      dashboardSelection.adjustmentTable.appendChild(row);
    });
  } catch (err) {
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
    }, 3000);
  }
};

const noWarehouseDisplay = () => {
  //no warehouse so remove the statistics charts.
  // dashboardSelection.warehouseSelect.style.display = 'none';
  dashboardSelection.lowStockTableCard.style.display = 'none';
  dashboardSelection.adjustmentTableCard.style.display = 'none';
  dashboardSelection.cancelledTableCard.style.display = 'none';
  dashboardSelection.noDashboardBox.style.display = 'flex';
  // dashboardSelection.noDashboardBox.innerHTML =
  //   displayToast.noWarehouseMessage();

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
        displayToast.noRecentActivity();
      return;
    }

    transactions.forEach((tx) => {
      let productName = 'Item';
      if (tx.product?.productName) {
        productName = tx.product.productName;
      } else if (tx.product?.name) {
        productName = tx.product.name;
      }

      let qty = 0;
      if (tx.quantity !== null && tx.quantity !== undefined) {
        qty = tx.quantity;
      } else if (tx.qty !== null && tx.qty !== undefined) {
        qty = tx.qty;
      }

      let performedBy = 'System';
      if (tx.performedBy?.name) {
        performedBy = tx.performedBy.name;
      } else if (tx.performedBy?.fullName) {
        performedBy = tx.performedBy.fullName;
      }

      let type = 'UNKNOWN';
      if (tx.type) {
        type = tx.type;
      } else if (tx._doc?.type) {
        type = tx._doc.type;
      }

      let updatedAt;
      if (tx.updatedAt) {
        updatedAt = tx.updatedAt;
      } else {
        updatedAt = tx.createdAt;
      }

      let time = '';
      if (updatedAt) {
        time = new Date(updatedAt).toLocaleString();
      }

      let dotClass = 'info';
      let actionText = `<strong>${productName}</strong> (${qty} units)`;

      if (type === 'IN') {
        const transactionDetails = displayToast.transactionIN(productName, qty);
        dotClass = transactionDetails.dotClass;
        actionText = transactionDetails.actionText;
      } else if (type === 'OUT') {
        const transactionDetails = displayToast.transactionOUT(
          productName,
          qty
        );
        dotClass = transactionDetails.dotClass;
        actionText = transactionDetails.actionText;
      } else if (type === 'TRANSFER') {
        let targetWarehouse = '';
        if (tx.destinationWarehouse?.name) {
          targetWarehouse = tx.destinationWarehouse.name;
        } else if (tx.sourceWarehouse?.name) {
          targetWarehouse = tx.sourceWarehouse.name;
        }
        const transactionDetails = displayToast.transactionTRANSFER(
          productName,
          qty,
          targetWarehouse
        );
        dotClass = transactionDetails.dotClass;
        actionText = transactionDetails.actionText;
      } else if (type === 'ADJUSTMENT' || type === 'ADJ') {
        const transactionDetails = displayToast.transactionADJUSTMENT(
          productName,
          qty
        );
        dotClass = transactionDetails.dotClass;
        actionText = transactionDetails.actionText;
      }

      dashboardSelection.recentActivityList.innerHTML +=
        displayToast.recentActivityItem({
          performedBy,
          actionText,
          time,
          dotClass,
        });
    });
  } catch (err) {
    dashboardSelection.recentActivityList.innerHTML =
      displayToast.noRecentActivity();
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );
    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
    }, 3000);
  }
  dashboardSelection.recentActivityList.addEventListener('click', (e) => {
    const activityItem = e.target.closest('.activity-item');
    if (!activityItem) return;

    window.location.href = 'http://localhost:8080/pages/reports.html';
  });
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
      dashboardSelection.noDashboardBox.innerHTML =
        displayToast.noWarehouseMessage(user.role);
      return false;
    }

    warehouseDisplay();
    warehouseSelect.innerHTML = '';
    warehouseSelect.innerHTML = displayToast.warehouseOption(
      warehouses[0],
      true
    );

    warehouses.slice(1).forEach((warehouse) => {
      warehouseSelect.insertAdjacentHTML(
        'beforeend',
        displayToast.warehouseOption(warehouse)
      );
    });

    return true;
  } catch (err) {
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
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

    dashboardSelection.carouselItems.innerHTML = '';

    products.forEach((product, index) => {
      let isActive = '';
      if (index === 0) {
        isActive = 'active';
      }

      // console.log(warehouseId, product.productId);

      const itemHTML = displayToast.carouselItem(
        warehouseId,
        product,
        isActive
      );

      dashboardSelection.carouselItems.innerHTML += itemHTML;
    });
  } catch (err) {
    dashboardSelection.toastSection.innerHTML = displayToast.errorToast(
      err.message
    );

    setTimeout(() => {
      dashboardSelection.toastSection.innerHTML = '';
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
  loadMostCancelledProducts,
  loadMostAdjustedProducts,
  showRecentTransactions,
  showTopSellingProductsSubscribe,
};
