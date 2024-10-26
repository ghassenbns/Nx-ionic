import { Component, Input, OnInit } from '@angular/core';
import { VehicleInterface, VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { CardConfigInterface } from '@concordia-nx-ionic/concordia-shared';

import { EntityMapComponent } from '../../../shared/entity-map/entity-map.component';

@Component({
  selector: 'concordia-nx-ionic-vehicles-map-card',
  templateUrl: '../../../shared/entity-map/entity-map.component.html',
  styleUrls: ['./vehicles-map-card.component.scss'],
})
export class VehiclesMapCardComponent extends EntityMapComponent<VehiclesApiService> implements OnInit {
  @Input() vehicle!: VehicleInterface;

  readonly config: CardConfigInterface = {
    selector: 'vehicleMap',
    title: 'lastPosition',
    editable: { state: false },
  };

  constructor(vehiclesApiService: VehiclesApiService) {
    super(vehiclesApiService);
  }

  ngOnInit(): void {
    this.cardConfig = this.config;
    this.mapData = this.getMapData(this.vehicle);
  }

}
