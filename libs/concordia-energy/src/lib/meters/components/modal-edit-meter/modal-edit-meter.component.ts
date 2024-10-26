import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  UsersApiService,
  UsersRelationshipsApiService,
  UsersRelationshipsInterface,
} from '@concordia-nx-ionic/concordia-api';
import { TimezonesStateService } from '@concordia-nx-ionic/concordia-api-store';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MeterInterface, MetersApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { PartialWithRequiredKey, Strategy } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { filter, first, Subscription, tap } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { v4 as uuidv4 } from 'uuid';

import { metersDataConfig } from '../meters-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-edit-meter',
  templateUrl: './modal-edit-meter.component.html',
  styleUrls: ['./modal-edit-meter.component.scss'],
})
export class ModalEditMeterComponent implements OnInit, OnDestroy {
  @ViewChild(NgForm) form!: NgForm;

  modalId = '';
  strategy: Strategy = JSON.parse(JSON.stringify(metersDataConfig));

  loading = false;
  model: any = {
    ownerId: null,
    localization: {
      address: '',
      latitude: '',
      longitude: '',
    },
  };
  customInfo: any[] = [];
  customTypes: any[] = [];

  PRE_DEFAULT_LOCALE = [
    {
      country: 'spain',
      address: 'Madrid, España',
      latitude: 40.418889,
      longitude: -3.691944,
      timezoneId: 239,
    },
    {
      country: 'peru',
      address: 'Lima, Perú',
      latitude: -12.035000,
      longitude: -77.018611,
      timezoneId: 89,
    },
    {
      country: 'lithuania',
      address: 'Vilnius, Lithuania',
      latitude: 54.678,
      longitude: 25.287,
      timezoneId: 294,
    },
  ];

  private subscription = new Subscription();

  constructor(
    public navParams: NavParams,
    private readonly modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly metersApiService: MetersApiService,
    private readonly notificationService: UINotificationStateService,
    private readonly userService: UserStateService,
    private readonly usersApiService: UsersApiService,
    private readonly timezonesStateService: TimezonesStateService,
    private readonly usersRelationshipsApiService: UsersRelationshipsApiService,
  ) {
  }

  ngOnInit(): void {
    if (this.navParams.get('modal')) {
      this.modalId = this.navParams.get('modal').id;
    }

    if (this.navParams.get('data')) {
      this.model = {
        ...this.model,
        ...this.navParams.get('data'),
      };

      this.customInfo = this.model.customInfo
        .map((c: any) => ({
          ...c,
          uuid: uuidv4(),
        }));

      this.getListCustomInfoTypes(this.model.country, this.model.meterType);

      this.strategy.columns.forEach(i => {
        if (i.field === 'type' || i.field === 'country') {
          i.disabled = true;
        }
      });
    }

    if (!this.model.ownerId) {
      this.userService.getUser$()
        .pipe(
          first(),
          filter(i => !!i),
          tap(i => {
            this.model.ownerId = i?.userId;
            this.getUsersRelationships(this.model.ownerId);
          }),
        )
        .subscribe();

    } else {
      this.getUsersRelationships(this.model.ownerId);
    }

    this.usersApiService.list()
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if(i.field === 'owner' || i.field === 'viewAsUser') {
            i.options = res.data;
          }
        });
      });

    this.timezonesStateService.loadTimezones();

    this.timezonesStateService.getTimezones()
      .subscribe(data => {
        if(data.length) {
          this.strategy.columns.forEach(i => {
            if (i.field === 'timezone') {
              i.options = data;
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeValue(event: any): void {
    if (event.rowSelector === 'country' || event.rowSelector === 'meterType') {
      if (event.form.country && event.form.meterType) {
        this.getListCustomInfoTypes(event.form.country, event.form.meterType);
      }
    }

    if (event.rowSelector === 'country') {
      const locale = this.PRE_DEFAULT_LOCALE
        .find(i => i.country === event.value.detail.value);

      if(locale) {
        this.model = {
          ...this.getObject(event.form),
          timezoneId: locale?.timezoneId,
          localization: {
            address: locale?.address,
            latitude: locale?.latitude,
            longitude: locale?.longitude,
          },
        };

      }
    } else if (event.rowSelector === 'meterType') {
      this.model = {
        ...this.getObject(event.form),
        country: null,
        timezoneId: null,
        localization: {
          address: null,
          latitude: null,
          longitude: null,
        },

      };

      this.strategy.columns.forEach(c => {
        if(c.field === 'country') {
          c.disabled = false;

          c.options.forEach(o => {
            o.hidden = !((event.value.detail.value === 'heat' && o._id === 'lithuania')
              || (event.value.detail.value !== 'heat' && o._id !== 'lithuania'));
          });
        }
      });

    }

    if(event.rowSelector === 'ownerId') {
      this.model = {
        ...this.getObject(event.form),
        clientId: null,
      };

      this.getUsersRelationships(event.value.detail.value);
    }
  }

  cancel(data: unknown = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: PartialWithRequiredKey<MeterInterface, '_id'>): void {
    if (this.form.valid) {
      const customInfo = Object.keys(this.form.value).map(key => this.form.value[key]);

      this.metersApiService.update(
        {
          ...this.getObject(event),
          customInfo,
        },
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
  }

  store(event: PartialWithRequiredKey<MeterInterface, '_id'>): void {
    if (this.form.valid) {
      const customInfo = Object.keys(this.form.value).map(key => this.form.value[key]);

      this.metersApiService.store(
        {
          ...this.getObject(event),
          customInfo,
        },
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
  }

  add(): void {
    this.customInfo = [
      ...this.customInfo,
      {
        customInfoTypeId: null,
        value: null,
        uuid: uuidv4(),
      },
    ];
  }

  delete(uuid: string): void {
    this.customInfo = this.customInfo.filter((i: any) => i.uuid !== uuid);
  }

  onSubmit(event: any): void {
    if(this.form.invalid) {
      this.form.control.markAllAsTouched();

      if(event.valid) {
        this.notificationService.error(
          this.translocoService.translate(`errors.notEmptyError`),
        );
      }

      return;
    }
  }

  getListCustomInfoTypes(country: string, meterType: string): void {
    const options = {
      params: {
        country,
        meter_type: meterType,
      },
    };

    this.metersApiService.listCustomInfoTypes(options)
      .subscribe(type => {
        this.customTypes = type.data.map(d => ({
          ...d,
          hidden: false,
        }));
      });
  }

  isUsed(customTypes: any[], value: any): any[] {
    return customTypes.map(c => ({
      ...c,
      hidden: !!Object.keys(value).find(key => value[key].customInfoTypeId === c.customInfoTypeId),
    }));
  }

  getObject(event: any): any {
    return Object.keys(event)
      .reduce((acc: any, key: any) => {
        const y = key.split('.');

        if(y.length > 1) {
          return {
            ...acc,
            [y[0]]: {
              ...acc[y[0]],
              [y[1]]: event[key],
            },
          };
        } else {
          return {
            ...acc,
            [key]: event[key],
          };
        }
      }, {});
  }

  getUsersRelationships(id: string): void {
    this.usersRelationshipsApiService.list({ params: { user_id: id } })
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(column => {
          if (column.field === 'client') {
            column.options = res.data.map((d: UsersRelationshipsInterface) => ({ ...d, name: d.relatedUser.name }));
          }
        });
      });
  }

  getValidatorType(info: any, customTypes: any[]): 'number' | 'string' {
    return customTypes.find(c=> c.customInfoTypeId === info.customInfoTypeId)?.type === 'number' ? 'number' : 'string';
  }

  getMessage(ngModel: any): string {
    let m = '';

    if(ngModel?.errors?.required) {
      m += ' Required.';
    }

    if(ngModel?.errors?.typeNumber) {
      m += ' Number.';
    }

    return m;
  }
}
