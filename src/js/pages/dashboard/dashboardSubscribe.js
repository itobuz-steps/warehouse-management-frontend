import api from '../../api/interceptor.js';
import Templates from '../../common/Templates.js';
import dashboardSelection from './dashboardSelector.js';
import config from '../../config/config.js';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const displayToast = new Templates();
const toastSection = document.getElementById('toastSection');

const showTopProductsSubscribe = async () => {
  try {
    const res = await api.get(`${config.DASHBOARD_BASE_URL}/get-top-products`);
    const products = res.data.topProducts;

    const labels = products.map((item) => item.productName);
    const quantities = products.map((item) => item.quantity);

    new Chart(dashboardSelection.barGraph, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Top 5 Stocked Products',
            data: quantities,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
      options: { responsive: true },
    });

  } catch (err) {
    // toastSection.innerHTML = displayToast.errorToast(err.response.data.message);
    console.log(err);

  } finally {
    setTimeout(() => {
      toastSection.innerHTML = '';
    }, 3000);
  }
};

export {
    showTopProductsSubscribe,
}
