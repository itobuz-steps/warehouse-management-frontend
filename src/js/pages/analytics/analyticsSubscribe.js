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

      analyticsSelection.warehouseSelect.innerHTML = `<option value="">Select Warehouse</option>`;

      warehouses.forEach((warehouse) => {
        analyticsSelection.warehouseSelect.innerHTML +=
          this.analyticsTemplate.warehouseOptions(warehouse);
      });

      analyticsSelection.warehouseSelect.addEventListener('change', (event) => {
        const selected = event.target.selectedOptions[0];
        const warehouseId = selected.id;

        analyticsSelection.productSelectSection.forEach((item) => {
          item.style.display = 'block';
        });

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

      const productDetails = result.data.data;

      analyticsSelection.productSelect1.innerHTML = `<option value="">Select First Product</option>`;
      analyticsSelection.productSelect2.innerHTML = `<option value="">Select Another Product</option>`;

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

      console.log(response1);

      await this.createBarChart(response1.data.data);

      const response2 = await api.get(
        `${config.PRODUCT_ANALYTICS_URL}/product-comparison-history?warehouseId=${warehouseId}&productA=${product1}&productB=${product2}`
      );

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
  };

  createLineChart = async (data) => {
    const dates = data.productA.history.map((item) => item.date).slice(-7);

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
            borderColor: '#ef58c9ff',
            backgroundColor: '#ef58c9ff',
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
}

export default AnalyticsSubscribe;
