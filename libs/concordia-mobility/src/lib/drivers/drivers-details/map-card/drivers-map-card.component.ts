import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  DriverDataInterface,
  DriversApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  CardConfigInterface,
} from '@concordia-nx-ionic/concordia-shared';

import { EntityMapComponent } from '../../../shared/entity-map/entity-map.component';

@Component({
  selector: 'concordia-nx-ionic-drivers-map-card',
  templateUrl: '../../../shared/entity-map/entity-map.component.html',
  styleUrls: ['./drivers-map-card.component.scss'],
})
export class DriversMapCardComponent extends EntityMapComponent<DriversApiService> implements OnInit {
  @Input() driver!: DriverDataInterface;
  readonly config: CardConfigInterface = {
    selector: 'driverMap',
    title: 'lastPosition',
    editable: { state: false },
  };

  constructor(driversServiceApi: DriversApiService) {
    super(driversServiceApi);
  }

  ngOnInit(): void {
    this.cardConfig = this.config;
    this.mapData = this.getMapData(this.driver);
  }

}
