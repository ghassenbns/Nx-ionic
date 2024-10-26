import { components } from './components';
import { FleetEditComponent } from './fleets-details/components/fleet-edit/fleet-edit.component';
import { FleetSmallCardsComponent } from './fleets-details/components/fleet-small-cards/fleet-small-cards.component';
import { FleetsDetailsComponent } from './fleets-details/fleets-details.component';
import { FleetsListComponent } from './fleets-list/fleets-list.component';

export const fleetsComponents = [
  ...components,
  FleetsListComponent,
  FleetsDetailsComponent,
  FleetSmallCardsComponent,
  FleetEditComponent,
];
