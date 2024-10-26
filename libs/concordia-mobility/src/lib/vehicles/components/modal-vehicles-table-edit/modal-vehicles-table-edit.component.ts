import { Component, OnInit } from '@angular/core';
import {
  DriverDataInterface,
  FleetsApiService,
  VehicleInterface,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
 EditTableContainerComponent,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import {
  catchError,
  finalize,
  first,
  tap,
  throwError,
} from 'rxjs';

import { vehiclesDataConfig } from '../vehicles-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-vehicles-table-edit',
  templateUrl: './modal-vehicles-table-edit.component.html',
  styleUrls: ['./modal-vehicles-table-edit.component.scss'],
})
export class ModalVehiclesTableEditComponent extends EditTableContainerComponent<DriverDataInterface> implements OnInit{
  constructor(
    navParams: NavParams,
    modalCtrl: ModalController,
    notificationService: UINotificationStateService,
    translocoService: TranslocoService,
    private readonly vehiclesApiService: VehiclesApiService,
    private readonly fleetsApiService: FleetsApiService,
  ) {
    super(navParams, modalCtrl, translocoService, notificationService);
  }

  ngOnInit(): void {
    this.strategy = vehiclesDataConfig;

    this.loading = {
      load_fleets: false,
      load_users: false,
      load_vehicles: false,
      create: false,
      update: false,
      delete: false,
    };

    this.setData();

    this.loading.load_fleets = true;
    this.fleetsApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_fleets = false;
        }),
      )
      .subscribe((res) => this.setOption('fleet', res.data));
  }

  storeMany(newItem: VehicleInterface[]): void {
    this.loading.create = true;

    this.vehiclesApiService.storeMany(newItem)
      .pipe(
        first(),
        finalize(() => {
          this.loading.create = false;
          this.closeModal();
        }),
        tap(vehicles => {
          this.addMany(vehicles.data);

          this.translate('success.savedVehicles', {
            count: vehicles.data.length,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        }),
        catchError(err => {
          this.setError(err.error);

          return throwError(err);
        }),
      )
      .subscribe();
  }

  editMany(item: PartialWithRequiredKey<VehicleInterface, '_id'>[]): void {
    this.loading.update = true;

    this.vehiclesApiService.editMany(item)
      .pipe(
        first(),
        finalize(() => {
          this.loading.update = false;
          this.closeModal();
        }),
        tap(vehicles => {
          this.updateMany(vehicles.data);

          this.translate('success.updatedVehicles', {
            count: vehicles.data.length,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        }),
        catchError(err => {
          this.setError(err.error);

          return throwError(err);
        }),
      ).subscribe();
  }

  deleteMany(item: PartialWithRequiredKey<DriverDataInterface, '_id'>[]): void {
    this.loading.delete = true;

    const data: PartialWithRequiredKey<DriverDataInterface, '_id'>[] = item.map(i => ({ _id: i._id }));

    this.vehiclesApiService.deleteMany(data)
      .pipe(
        first(),
        finalize(() => {
          this.loading.delete = false;
          this.closeModal();
        }),
        tap(vehicles => {
          this.removeMany(data);

          this.translate('success.deletedVehicles', {
            count: vehicles.data,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        }),
        catchError(err => {
          this.setError(err.error);

          return throwError(err);
        }),
      ).subscribe();
  }
}
