import '../../../scss/styles.scss';
import '../../../scss/analytics.scss';

/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-expect-error Bootstrap import
import * as bootstrap from 'bootstrap';

import AnalyticsSubscribe from './analyticsSubscribe.js';
import analyticsSelection from './analyticsSelector.ts';

const analyticsSubscribe = new AnalyticsSubscribe();

document.addEventListener('DOMContentLoaded', () => {
  analyticsSubscribe.loadOptions();
});

analyticsSelection.analyticsForm?.addEventListener(
  'submit',
  analyticsSubscribe.getComparisonData
);

analyticsSelection.transactionExcel?.addEventListener(
  'click',
  analyticsSubscribe.getTwoProductTransactionExcel
);

analyticsSelection.quantityExcel?.addEventListener(
  'click',
  analyticsSubscribe.getTwoProductQuantityExcel
);
