import { Component } from '@angular/core';
import { Strategy } from '@concordia-nx-ionic/concordia-shared';

import { addTripsDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-trip-menu',
  templateUrl: './trip-menu.component.html',
  styleUrls: ['./trip-menu.component.scss'],
})
export class TripMenuComponent {
  addStrategy: Partial<Strategy> = addTripsDataConfig;
}
