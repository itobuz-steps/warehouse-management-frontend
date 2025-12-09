import api from '../../api/interceptor.js';
import AnalyticsTemplate from '../../common/template/AnalyticsTemplate.js';
import config from '../../config/config.js';
import analyticsSelection from './analyticsSelector';

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
      console.log('Loaded products:', productDetails);

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
    event.preventDefault();

    const formData = new FormData(event.target);

    const warehouseId = formData.get('warehouseSelect');
    const product1 = formData.get('productSelect1');
    const product2 = formData.get('productSelect2');

    console.log('Comparison submitted:', { warehouseId, product1, product2 });

    // TODO: Add API call for comparison here
    // const response = await api.post('/compare', { warehouseId, product1, product2 });
  };
}

export default AnalyticsSubscribe;
