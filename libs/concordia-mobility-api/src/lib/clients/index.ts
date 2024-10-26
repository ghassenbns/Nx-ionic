import { CompSignalsApiService } from './comp-signals-api.service';
import { DriversApiService } from './drivers-api.service';
import { FleetsApiService } from './fleets-api.service';
import { NodesViewApiService } from './nodes-view-api.service';
import { RelatedUsersApiService } from './related-users-api.service';
import { TripsApiServices } from './trips-api.service';
import { VehiclesApiService } from './vehicles-api.service';

export const clients = [
  VehiclesApiService,
  FleetsApiService,
  DriversApiService,
  RelatedUsersApiService,
  NodesViewApiService,
  CompSignalsApiService,
  TripsApiServices,
];

export * from './comp-signals-api.service';
export * from './drivers-api.service';
export * from './fleets-api.service';
export * from './nodes-view-api.service';
export * from './related-users-api.service';
export * from './trips-api.service';
export * from './vehicles-api.service';
