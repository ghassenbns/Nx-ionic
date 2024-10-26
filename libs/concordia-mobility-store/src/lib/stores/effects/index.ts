import { DriversEffectsService } from './drivers.effects.service';
import { TripsEffects } from './trips.effects.service';
import { VehiclesEffects } from './vehicles.effects.service';

export const effects: any[] = [
  TripsEffects,
  VehiclesEffects,
  DriversEffectsService,
];
