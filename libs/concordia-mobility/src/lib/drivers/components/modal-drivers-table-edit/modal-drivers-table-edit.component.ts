import { Component, OnInit } from '@angular/core';
import {
  DriverDataInterface,
  DriversApiService,
  FleetsApiService,
  RelatedUsersApiService,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  EditTableContainerComponent,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { catchError, finalize, first, tap, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { driverDataConfig } from '../drivers-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-drivers-table-edit',
  templateUrl: './modal-drivers-table-edit.component.html',
  styleUrls: ['./modal-drivers-table-edit.component.scss'],
})
export class ModalDriversTableEditComponent extends EditTableContainerComponent<DriverDataInterface> implements OnInit {
  currentFleets: Set<string> = new Set();

  constructor(
    navParams: NavParams,
    modalCtrl: ModalController,
    notificationService: UINotificationStateService,
    translocoService: TranslocoService,
    private readonly driversApiService: DriversApiService,
    private readonly fleetsApiService: FleetsApiService,
    private readonly relatedUsersApiService: RelatedUsersApiService,
    private readonly vehiclesApiService: VehiclesApiService,
  ) {
    super(navParams, modalCtrl, translocoService, notificationService);
  }

  ngOnInit(): void {
    this.strategy = driverDataConfig;

    this.loading = {
      load_fleets: false,
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

    this.loading.load_users = true;
    this.relatedUsersApiService.listDriversUsers()
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_users = false;
        }),
      )
      .subscribe((res) => {
        return this.setOption('user', res.data
          .map(user => ({
              ...user,
              hidden: user.hasDriver || this.selectedData.data.some((r: any) => r.userId === user.userId),
              notAdmit: this.selectedData.data.some((r: any) => r.userId === user.userId),
            }),
          ));
      });

    this.currentFleets = new Set(this.selectedData.data.map((i: DriverDataInterface) => i.fleetId));

    this.loadVehicles();

  }

  override duplicate(row: any): void {
    this.selectedData = {
      data: [
        ...this.selectedData.data,
        {
          ...row,
          name: `${row.name}_copy`,
          _id: null,
          userId: null,
          userDetails: null,
          uuid: uuidv4(),
          status: 'new',
          error: '',
          changed: true,
        },
      ],
    };
  }

  storeMany(newItem: PartialWithRequiredKey<DriverDataInterface, '_id'>[]): void {
    this.loading.create = true;

    this.driversApiService.storeMany(newItem)
      .pipe(
        first(),
        finalize(() => {
          this.loading.create = false;
          this.closeModal();
        }),
        tap(drivers => {
          this.addMany(drivers.data);

          this.translate('success.savedDriver', {
            count: drivers.data.length,
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

  editMany(item: PartialWithRequiredKey<DriverDataInterface, '_id'>[]): void {
    this.loading.update = true;

    this.driversApiService.editMany(item)
      .pipe(
        first(),
        finalize(() => {
          this.loading.update = false;
          this.closeModal();
        }),
        tap(drivers => {
          this.updateMany(drivers.data);

          this.translate('success.updatedDriver', {
            count: drivers.data.length,
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

    this.driversApiService.deleteMany(data)
      .pipe(
        first(),
        finalize(() => {
          this.loading.delete = false;
          this.closeModal();
        }),
        tap(drivers => {
          this.removeMany(data);

          this.translate('success.deletedDriver', {
            count: drivers.data,
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

  changeValue(event: any): void {
    if(event.rowSelector === 'fleet'){
      this.loadVehicles(event.value);
      event.row.defaultVehicleId = null;
      event.row.fleetDetails = null;
    } else if (event.rowSelector === 'user') {
      this.updateHidden();
    }
  }

  private loadVehicles(fleetId = ''): void {
    if(this.currentFleets.has(fleetId)){
      return;
    }

    const fleets = new Set([...this.currentFleets, ...this.selectedData.data.map((i: any) => i.fleetId)]);
    const params = {
      filter: JSON.stringify([{
        scope: 'fleetId',
        operator: 'in',
        value: [...fleets],
        type: 'object-id',
      }]),
    };

    this.loading.load_vehicles = true;
    this.vehiclesApiService.list({ params: params })
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_vehicles = false;
        }),
      )
      .subscribe((res) => this.setOption('vehicle', res.data));
  }

  override updateHidden(): void {
    this.strategy.columns.forEach(column => {
      if(column.field === 'user') {
        column.options
          .filter(user => user.notAdmit)
          .forEach(user => {
            user.hidden = this.selectedData.data.some((r: any) => r.userId === user.userId && !r.toBeDeleted);
          });
      }
    });

    super.updateHidden();
  }
}
