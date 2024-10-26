import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  DriverDataInterface,
  FleetDataInterface,
  UserRelationInterface,
  VehicleInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  BooleanState,
  CardConfigInterface,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { ModelEditDriverComponent } from '../../components/model-edit-driver/model-edit-driver.component';

@Component({
  selector: 'concordia-nx-ionic-drivers-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss'],
})
export class DriversDetailsCardComponent implements OnInit {
  @Input() driver!: DriverDataInterface;
  @Input() editMode!: BehaviorSubject<BooleanState>;
  @Input() isLoading!: boolean;

  @Output() submitted = new EventEmitter<DriverDataInterface>();

  /**
   * List of owners related with the logged-in user
   * @type {Observable<UserRelationModel[]>}
   * @memberof DetailsCardComponent
   */
  relatedUsers$!: Observable<UserRelationInterface[]>;
  form!: UntypedFormGroup;
  cardConfig!: CardConfigInterface;
  userRelatedFleets$!: Observable<FleetDataInterface[]>;
  fleetRelatedVehicles$!: Observable<VehicleInterface[]>;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.cardConfig = {
      selector: 'details',
      title: 'details',
      editable: { state : this.driver.isEditable, mode: 'modal' },
    };
  }

  async onEditModal(
    event: any,
    driver: PartialWithRequiredKey<DriverDataInterface, '_id'> | null = null,
  ): Promise<void> {
    if (event) {
      const modal = await this.modalCtrl.create({
        component: ModelEditDriverComponent,
        ...(driver && {
          componentProps: { data: driver },
        }),
      });
      modal.present();

      const { data } = await modal.onWillDismiss();

      if (data?.status === 'ok') {
        this.submitted.emit(data.data);
      }
    }
  }
}
