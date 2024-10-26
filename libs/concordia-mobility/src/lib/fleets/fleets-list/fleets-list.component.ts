import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'concordia-nx-ionic-fleets-list',
  templateUrl: './fleets-list.component.html',
  styleUrls: ['./fleets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetsListComponent {}
