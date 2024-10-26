import { Component, Input } from '@angular/core';
import {
  FleetDataInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';

@Component({
  selector: 'concordia-nx-ionic-fleet-small-cards',
  templateUrl: './fleet-small-cards.component.html',
  styleUrls: ['./fleet-small-cards.component.scss'],
})
export class FleetSmallCardsComponent {
  @Input() fleet!: FleetDataInterface | null;
}
