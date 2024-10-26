import { Component, OnInit } from '@angular/core';
import {
  DriverDataInterface,
  DriversApiService,
  FleetsApiService,
  RelatedUsersApiService,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  HttpResponseEntityType,
  HttpResponseListType,
  PartialWithRequiredKey,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, noop } from 'rxjs';

import { driverDataConfig } from '../drivers-table/config';

@Component({
  selector: 'concordia-nx-ionic-model-edit-driver',
  templateUrl: './model-edit-driver.component.html',
  styleUrls: ['./model-edit-driver.component.scss'],
})
export class ModelEditDriverComponent implements OnInit {
  strategy: Strategy = JSON.parse(JSON.stringify(driverDataConfig));
  loading = false;
  model: Partial<DriverDataInterface> = {};
  readonlyFields: string[] = [];

  constructor(
    private readonly navParams: NavParams,
    private readonly modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly driversApiService: DriversApiService,
    private readonly vehiclesApiService: VehiclesApiService,
    private readonly fleetsApiService: FleetsApiService,
    private readonly relatedUsersApiService: RelatedUsersApiService,
    private readonly notificationService: UINotificationStateService,
  ) {
  }

  ngOnInit(): void {
    this.readonlyFields = this.navParams.get('readonlyFields');

    if((this.navParams.data as any).data){
      this.model = { ...(this.navParams.data as any).data };

      if(this.model.fleetId) {
        this.getVehicles(this.model.fleetId);
      }
    }

    this.loading = true;

    this.fleetsApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.strategy.columns.forEach((i) => {
          if(i.field === 'fleet') {
            i.options = res.data;
          }
        });
      });

    this.relatedUsersApiService.listDriversUsers()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.strategy.columns.forEach((i) => {
          if(i.field === 'user') {
            i.options = res.data.map(user => ({
              ...user,
              hidden: user.hasDriver,
            }));
          }
        });
      });
  }

  cancel(data: HttpResponseEntityType<DriverDataInterface>
    | HttpResponseListType<DriverDataInterface> | null = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: PartialWithRequiredKey<DriverDataInterface, '_id'>): void {
    this.driversApiService.edit(
      event,
    )
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(
      (i) => this.cancel(i).then(),
      ({ error }) => {
        this.notificationService.error(
          error.data.errors
            .map((i: any) =>
              'errorDetails' in i
                ? i.errorDetails.join(' ')
                : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
        );
      },
    );
  }

  store(event: PartialWithRequiredKey<DriverDataInterface, '_id'>): void {
    this.driversApiService.store(
      event,
    )
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(
      (i) => this.cancel(i).then(),
      ({ error }) => {
        this.notificationService.error(
          error.data.errors
            .map((i: any) =>
              'errorDetails' in i
                ? i.errorDetails.join(' ')
                : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
        );
      },
    );
  }

  changeValue(event: any): void {
    switch (event.rowSelector) {
      case 'fleetId':
        // this.model.defaultVehicleId = null;
        event.form.defaultVehicleId = null;

        return this.getVehicles(event.value);

      default:
        noop();
    }

  }

  getVehicles(id: string): void {
    const params = {
      filter: JSON.stringify([{
        scope: 'fleetId',
        operator: '=',
        value: id,
        type: 'object-id',
      }]),
    };

    this.vehiclesApiService.list({ params: params })
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.strategy.columns.forEach((i) => {
          if(i.field === 'vehicle') {
            i.options = res.data;
          }
        });
      });
  }
}
