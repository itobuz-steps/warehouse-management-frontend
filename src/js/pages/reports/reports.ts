import '../../../scss/reports.scss';
// @ts-expect-error bootstrap need to be imported this way
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import transactionDetailsLoad from './reportsSubscribe';

document.addEventListener('DOMContentLoaded', transactionDetailsLoad);
