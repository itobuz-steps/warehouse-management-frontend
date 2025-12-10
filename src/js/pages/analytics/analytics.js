import '../../../scss/styles.scss';
import '../../../scss/analytics.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AnalyticsSubscribe from './AnalyticsSubscribe.js';
import analyticsSelection from './analyticsSelector.js';

const analyticsSubscribe = new AnalyticsSubscribe();

document.addEventListener('DOMContentLoaded', () => {
  analyticsSubscribe.loadOptions();
});

analyticsSelection.analyticsForm.addEventListener(
  'submit',
  analyticsSubscribe.getComparisonData
);

analyticsSelection.quantityExcel.addEventListener(
  'click',
  analyticsSubscribe.getTwoProductQuantityExcel
);
