import api from '../../api/interceptor.js';
import AnalyticsTemplate from '../../common/template/AnalyticsTemplate.js';
import config from '../../config/config.js';
import analyticsSelection from './analyticsSelector.js';
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

let barGraph = null;
let lineGraph = null;

class AnalyticsSubscribe {
  analyticsTemplate = new AnalyticsTemplate();

  loadOptions = async () => {
    try {
      const result = await api.get(
        `${config.WAREHOUSE_BASE_URL}/get-warehouses`
      );

      const warehouses = result.data.data;

      warehouses.forEach((warehouse) => {
        analyticsSelection.warehouseSelect.innerHTML +=
          this.analyticsTemplate.warehouseOptions(warehouse);
      });

      // For on page load charts
      const defaultWarehouseId = warehouses[0]._id;

      const result2 = await api.get(
        `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${defaultWarehouseId}`
      );
      const products = result2.data.data;

      if (products.length <= 1) {
        analyticsSelection.noDataSection.classList.remove('d-none');
      }

      products.forEach((product) => {
        const productOption = this.analyticsTemplate.productOptions(product);

        analyticsSelection.productSelect1.innerHTML += productOption;
        analyticsSelection.productSelect2.innerHTML += productOption;
      });

      const defaultProduct1Id = products[0].productId;
      const defaultProduct2Id = products[0].productId;

      const response1 = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/product-quantities?warehouseId=${defaultWarehouseId}&productA=${defaultProduct1Id}&productB=${defaultProduct2Id}`
      );

      await this.createBarChart(response1.data.data);

      const response2 = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/product-comparison-history?warehouseId=${defaultWarehouseId}&productA=${defaultProduct1Id}&productB=${defaultProduct2Id}`
      );

      await this.createLineChart(response2.data.data);

      // On change option result flow
      analyticsSelection.warehouseSelect.addEventListener('change', (event) => {
        const selected = event.target.selectedOptions[0];
        const warehouseId = selected.id;

        this.loadProductOptions(warehouseId);
      });
    } catch (err) {
      console.error('Error loading warehouse options:', err);
    }
  };

  loadProductOptions = async (warehouseId) => {
    try {
      const result = await api.get(
        `${config.QUANTITY_BASE_URL}/warehouse-specific-products/${warehouseId}`
      );

      analyticsSelection.productSelect1.innerHTML = '';
      analyticsSelection.productSelect2.innerHTML = '';

      const productDetails = result.data.data;

      productDetails.forEach((product) => {
        const productOption = this.analyticsTemplate.productOptions(product);

        analyticsSelection.productSelect1.innerHTML += productOption;
        analyticsSelection.productSelect2.innerHTML += productOption;
      });
    } catch (err) {
      console.error('Error loading product options:', err);
    }
  };

  getComparisonData = async (event) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.target);

      const warehouseId = formData.get('warehouseSelect');
      const product1 = formData.get('productSelect1');
      const product2 = formData.get('productSelect2');

      analyticsSelection.noDataSection.style.display = 'none';
      analyticsSelection.chartGrid.style.display = 'grid';

      const response1 = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/product-quantities?warehouseId=${warehouseId}&productA=${product1}&productB=${product2}`
      );

      await this.createBarChart(response1.data.data);

      const response2 = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/product-comparison-history?warehouseId=${warehouseId}&productA=${product1}&productB=${product2}`
      );

     // console.log(response2.data.data);

      await this.createLineChart(response2.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  createBarChart = async (data) => {
    const barChart = analyticsSelection.barChart;

    let labels = new Array(data.productA.name, data.productB.name);
    let quantities = new Array(data.productA.quantity, data.productB.quantity);

    if (barGraph) {
      barGraph.destroy();
    }

    barGraph = new Chart(barChart, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: quantities,
            backgroundColor: ['#ff6384', '#9966ff'],
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
      },
    });
  };

  createLineChart = async (data) => {
    const dates = data.productA.history.map((item) => item.date);

    const productATransactions = data.productA.history.map(
      (item) => item.transactions
    );

    const productBTransactions = data.productB.history.map(
      (item) => item.transactions
    );

    if (lineGraph) {
      lineGraph.destroy();
    }

    lineGraph = new Chart(analyticsSelection.lineChart, {
      type: 'line',
      data: {
        labels: dates, // last 7 days
        datasets: [
          {
            label: data.productA.name,
            data: productATransactions,
            borderWidth: 2,
            fill: false,
            borderColor: '#50af95',
            backgroundColor: '#50af95',
          },
          {
            label: data.productB.name,
            data: productBTransactions,
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
  };

  getTwoProductQuantityExcel = async () => {
    try {
      const warehouseId = analyticsSelection.warehouseSelect.value;
      const product1Id = analyticsSelection.productSelect1.value;
      const product2Id = analyticsSelection.productSelect2.value;

      const result = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/get-two-products-quantity-chart-data?warehouseId=${warehouseId}&productA=${product1Id}&productB=${product2Id}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'two-products-quantity.xlsx';
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  getTwoProductTransactionExcel = async () => {
    try {
      const warehouseId = analyticsSelection.warehouseSelect.value;
      const product1Id = analyticsSelection.productSelect1.value;
      const product2Id = analyticsSelection.productSelect2.value;

      const result = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/get-two-products-transaction-chart-data?warehouseId=${warehouseId}&productA=${product1Id}&productB=${product2Id}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'two-products-transaction.xlsx';
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };
}

export default AnalyticsSubscribe;
