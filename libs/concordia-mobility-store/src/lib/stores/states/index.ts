import { DriversStateService } from './drivers.state';
import { TripStateService } from './trips.state';
import { VehicleStateService } from './vehicles.state';

export const states: any[] = [
  TripStateService,
  VehicleStateService,
  DriversStateService,
];

export * from './drivers.state';
export * from './trips.state';
export * from './vehicles.state';
