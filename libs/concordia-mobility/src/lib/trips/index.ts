import { components } from './components';
import { TripAnalysisContainerComponent } from './trip-analysis-container/trip-analysis-container.component';
import { TripMenuComponent } from './trip-menu/trip-menu.component';
import { TripsAnalysisComponent } from './trips-analysis/trips-analysis.component';
import { TripsDetailsComponent } from './trips-details/trips-details.component';
import { TripsListComponent } from './trips-list/trips-list.component';

export const tripsComponents = [
    ...components,
  TripsListComponent,
  TripsDetailsComponent,
  TripsAnalysisComponent,
  TripMenuComponent,
  TripAnalysisContainerComponent,
];
