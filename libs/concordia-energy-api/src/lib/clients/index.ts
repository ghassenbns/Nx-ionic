import { HierarchiesApiService } from './hierarchies-api.service';
import { MetersApiService } from './meters-api.service';
import { MetersConsumptionComparisonApiService } from './meters-consumption-comparison-api.service';
import { MetersContractsApiService } from './meters-contracts-api.service';
import { MetersSignalsApiService } from './meters-signals-api.service';
import { TariffsApiService } from './tariffs-api.service';

export const clients = [
  MetersApiService,
  MetersContractsApiService,
  MetersSignalsApiService,
  TariffsApiService,
  MetersConsumptionComparisonApiService,
  HierarchiesApiService,
];

export * from './hierarchies-api.service';
export * from './meters-api.service';
export * from './meters-consumption-comparison-api.service';
export * from './meters-contracts-api.service';
export * from './meters-signals-api.service';
export * from './tariffs-api.service';
