import {
  ConsumptionComparisonChartComponent,
} from './consumption-comparison-chart/consumption-comparison-chart.component';
import {
  ConsumptionComparisonFilterComponent,
} from './consumption-comparison-filter/consumption-comparison-filter.component';
import { ValidAggregationPeriodDirective } from './consumption-comparison-filter/valid-aggregation-period.directive';
import {
  ConsumptionComparisonTableComponent,
} from './consumption-comparison-table/consumption-comparison-table.component';

export const components = [
  ConsumptionComparisonFilterComponent,
  ConsumptionComparisonTableComponent,
  ConsumptionComparisonChartComponent,
  ValidAggregationPeriodDirective,
];
