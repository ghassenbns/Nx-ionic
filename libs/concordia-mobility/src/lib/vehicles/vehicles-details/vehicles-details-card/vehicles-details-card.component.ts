import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  VehicleInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  BooleanState,
  CardConfigInterface,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { ModalEditVehicleComponent } from '../../components/modal-edit-vehicle/modal-edit-vehicle.component';

@Component({
  selector: 'concordia-nx-ionic-vehicles-details-card',
  templateUrl: './vehicles-details-card.component.html',
  styleUrls: ['./vehicles-details-card.component.scss'],
})
export class VehiclesDetailsCardComponent implements OnInit {
  @Input() vehicle!: VehicleInterface;
  @Input() editMode!: BehaviorSubject<BooleanState>;
  @Input() isLoading!: boolean;

  @Output() submitted = new EventEmitter<VehicleInterface>();

  /**
   * List of owners related with the logged-in user
   * @type {Observable<UserRelationModel[]>}
   * @memberof DetailsCardComponent
   */
  form!: UntypedFormGroup;
  cardConfig!: CardConfigInterface;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.cardConfig = {
      selector: 'details',
      title: 'details',
      editable: { state : this.vehicle.isEditable, mode: 'modal' },
    };
  }

  async onEditModal(
    event: any,
    vehicle: PartialWithRequiredKey<VehicleInterface, '_id'>,
  ): Promise<void> {
    if (event) {
      const modal = await this.modalCtrl.create({
        component: ModalEditVehicleComponent,
        ...(vehicle && {
          componentProps: { data: vehicle },
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
