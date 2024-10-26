import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TripsDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';

@Component({
  selector: 'concordia-nx-ionic-trip-small-cards',
  templateUrl: './trip-small-cards.component.html',
  styleUrls: ['./trip-small-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripSmallCardsComponent {
  @Input() loading = false;
  @Input() trip!: TripsDataInterface | undefined | null;
}
