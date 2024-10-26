import { testFiltersUI } from './data-table-filters-ui.spec';
import { testFooterUI } from './data-table-footer-ui.spec';
import { testDataTableUI } from './data-table-ui.spec';

const fleetsStrategyUrl = 'table-strategies/fleets-table-config';
const driversStrategyUrl = 'table-strategies/drivers-table-config';
const vehiclesStrategyUrl = 'table-strategies/vehicles-table-config';
const tripsStrategyUrl = 'table-strategies/trips-table-config';

describe('Data table UI', () => {
  context('Filters UI - Fleets', testFiltersUI(fleetsStrategyUrl));
  context('Table UI - Fleets', testDataTableUI(fleetsStrategyUrl));
  context('Footer UI - Fleets', testFooterUI(fleetsStrategyUrl));
  context('Filters UI - vehicles', testFiltersUI(vehiclesStrategyUrl));
  context('Table UI - vehicles', testDataTableUI(vehiclesStrategyUrl));
  context('Footer UI - vehicles', testFooterUI(vehiclesStrategyUrl));
  context('Filters UI - trips', testFiltersUI(tripsStrategyUrl));
  context('Table UI - trips', testDataTableUI(tripsStrategyUrl));
  context('Footer UI - trips', testFooterUI(tripsStrategyUrl));
  context('Filters UI - Drivers - Mobile', testFiltersUI(driversStrategyUrl, 'samsung-s10'));
  context('Table UI - Drivers - Mobile', testDataTableUI(driversStrategyUrl, 'samsung-s10'));
  context('Footer UI - Drivers - Mobile', testFooterUI(driversStrategyUrl, 'samsung-s10'));
});