import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  TripsDataInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { BooleanState, CardConfigInterface, PartialWithRequiredKey } from '@concordia-nx-ionic/concordia-shared';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { ModelEditTripsComponent } from '../model-edit-trips/model-edit-trips.component';

@Component({
  selector: 'concordia-nx-ionic-trips-card',
  templateUrl: './trips-card.component.html',
  styleUrls: ['./trips-card.component.scss'],
})
export class TripsCardComponent implements OnInit {
  @Input() trip!: TripsDataInterface;
  @Input() editMode!: BehaviorSubject<BooleanState>;
  @Input() isLoading!: boolean;

  @Output() submitted = new EventEmitter<TripsDataInterface>();

  /**
   * List of owners related with the logged-in user
   * @type {Observable<UserRelationModel[]>}
   * @memberof DetailsCardComponent
   */
  form!: UntypedFormGroup;
  cardConfig!: CardConfigInterface;

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit(): void {
    this.cardConfig = {
      selector: 'details',
      title: 'details',
      editable: { state: this.trip.isEditable, mode: 'modal' },
    };
  }

  async onEditModal(
    event: any,
    trip: PartialWithRequiredKey<TripsDataInterface, '_id'> | null = null,
  ): Promise<void> {
    if(event) {
      const modal = await this.modalCtrl.create({
        component: ModelEditTripsComponent,
        cssClass: `w-2`,
        ...(trip && {
          componentProps: { data: trip },
        }),
      });
      modal.present();

      const { data } = await modal.onWillDismiss();

      if(data?.status === 'ok') {
        this.submitted.emit(data.data);
      }
    }
  }
}
