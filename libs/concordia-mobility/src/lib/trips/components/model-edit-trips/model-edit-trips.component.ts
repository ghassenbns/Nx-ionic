import { Component, OnInit } from '@angular/core';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  DriversApiService,
  FleetsApiService,
  TripsApiServices,
  TripsDataInterface,
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
import * as dayjs from 'dayjs';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { finalize, first, noop } from 'rxjs';
import { tap } from 'rxjs/operators';

import { tripsDataConfig } from '../trips-table/config';

@Component({
  selector: 'concordia-nx-ionic-model-edit-trips',
  templateUrl: './model-edit-trips.component.html',
  styleUrls: ['./model-edit-trips.component.scss'],
})
export class ModelEditTripsComponent implements OnInit {
  strategy: Strategy = JSON.parse(JSON.stringify(tripsDataConfig));
  loading = false;
  clone = false;
  readonlyFields: string[] = [];
  _id = null;
  model: Partial<TripsDataInterface> = {};
  now: any;

  constructor(
    private readonly navParams: NavParams,
    private readonly modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly tripsApiServices: TripsApiServices,
    private readonly driversApiService: DriversApiService,
    private readonly vehiclesApiService: VehiclesApiService,
    private readonly fleetsApiService: FleetsApiService,
    private readonly notificationService: UINotificationStateService,
    private readonly userState: UserStateService,
  ) {
  }

  ngOnInit(): void {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(localeData);

    this.userState.getTZ$()
      .pipe(
        tap((tz: string | null) => {
          if(tz){
            this.now = dayjs().utcOffset(tz).startOf('minutes');
          }
        }),
      ).subscribe();

    this.clone = this.navParams.get('clone');
    this.readonlyFields = this.navParams.get('readonlyFields') ?? [];

    if(this.clone) {
      this._id = this.navParams.get('_id');
    }

    if(this.navParams.get('data')){
      this.model = { ...this.navParams.get('data') };

      if(this.model?.plannedStartDate) {
        const min = dayjs(this.now).diff(dayjs(this.model.plannedStartDate), 'minute') > 0
          ? this.model.plannedStartDate
          : this.now;

        this.setMin(min, 'plannedStartDate');
        this.setMin(min, 'plannedEndDate');
      }

      if(this.model?.plannedEndDate) {
        this.setMax(dayjs(this.model.plannedEndDate).subtract(1, 'minute').valueOf());
      }

      if(this.model.fleetId) {
        this.getVehicles(this.model.fleetId);
        this.getDrivers(this.model.fleetId);
      }

      if(this.model?.tripStatusId && this.model.tripStatusId > 1) {
        this.strategy.columns.forEach((i) => {
          if(i.field !== 'status') {
            i.disabled = true;
          }
        });
      }

      if(this.model?._id) {
        this.tripsApiServices.statuses(this.model._id)
          .pipe(
            first(),
            finalize(() => {
              this.loading = false;
            }),
          )
          .subscribe((res) => {
            this.strategy.columns.forEach((i) => {
              if(i.field === 'status') {
                i.options = res.data.map(d => ({
                  ...d,
                  hidden: !d.isEnabled,
                }));
              }
            });
          });
      }
    }

    if(this.clone || !this.model._id) {
      this.readonlyFields.push('tripStatusId');
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
  }

  cancel(data: HttpResponseEntityType<TripsDataInterface>
    | HttpResponseListType<TripsDataInterface> | null = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: PartialWithRequiredKey<TripsDataInterface, '_id'>): void {
    this.tripsApiServices.edit(
      event,
    ).pipe(
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

  onClone(event: PartialWithRequiredKey<TripsDataInterface, '_id'>): void {
    if(this._id) {
      this.tripsApiServices.clone(
        this._id, event,
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
  }

  store(event: PartialWithRequiredKey<TripsDataInterface, '_id'>): void {
    this.tripsApiServices.store(
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
          error.data.errors.map((i: any) =>
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
        event.form.vehicleId = null;
        event.form.driverId = null;

        this.getVehicles(event.value);
        this.getDrivers(event.value);

        return noop();

      case 'plannedStartDate':
        this.setMin(event.value);

        return noop();

      case 'plannedEndDate':
        this.setMax(event.value);

        return noop();

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

  getDrivers(id: string): void {
    const params = {
      filter: JSON.stringify([{
        scope: 'fleetId',
        operator: '=',
        value: id,
        type: 'object-id',
      }]),
    };

    this.driversApiService.list({ params: params })
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.strategy.columns.forEach((i) => {
          if(i.field === 'driver') {
            i.options = res.data;
          }
        });
      });
  }

  setMin(value: number, field = 'plannedEndDate'): void {
    this.strategy.columns.forEach((i) => {
      if(i.field === field) {
        i.minDateFull = dayjs(value).add(field === 'plannedEndDate' ? 1 : 0, 'minute').valueOf();
      }
    });
  }

  setMax(value: number): void {
    this.strategy.columns.forEach((i) => {
      if(i.field === 'plannedStartDate') {
        i.maxDateFull = dayjs(value).subtract(1, 'minute').valueOf();
      }
    });
  }
}
