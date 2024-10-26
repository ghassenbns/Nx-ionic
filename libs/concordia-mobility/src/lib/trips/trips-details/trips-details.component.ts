import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TripsApiServices,
  TripsDataInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { BooleanState, EntityDetailsComponent, PartialWithRequiredKey } from '@concordia-nx-ionic/concordia-shared';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

import { ModelEditTripsComponent } from '../components/model-edit-trips/model-edit-trips.component';

@Component({
  selector: 'concordia-nx-ionic-trips-details',
  templateUrl: './trips-details.component.html',
  styleUrls: ['./trips-details.component.scss'],
})
export class TripsDetailsComponent extends EntityDetailsComponent<TripsApiServices> implements OnInit {
  private _trip: Subject<TripsDataInterface> = new Subject();
  trip$: Observable<TripsDataInterface> = this._trip.asObservable();

  loading = false;

  private readonly INITIAL_EDIT_STATE = {
    global: false,
    details: false,
    position: false,
  };

  editMode = new BehaviorSubject<BooleanState>(this.INITIAL_EDIT_STATE);

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    private modalCtrl: ModalController,
    public readonly tripsApiServices: TripsApiServices,
  ) {
    super(tripsApiServices, activatedRoute, router);
  }

  ngOnInit(): void {
    this.getEntityFromQueryId('/trips').pipe(
      tap(body => this._trip.next(body)),
    ).subscribe();
  }

  updateTrip(body: TripsDataInterface): void {
    this._trip.next(body);
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
        this.updateTrip(data.data);
      }
    }
  }
}
