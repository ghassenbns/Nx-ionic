import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import {
  FleetsApiService,
  TripsApiServices,
  TripsDataInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  AlertService,
  MultiActionEnum,
  MultiActionEvent,
  paramsFn,
  PartialWithRequiredKey,
  Strategy,
  TableContainerComponent,
  TableInputDataInterface,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first } from 'rxjs';

import { ModelEditTripsComponent } from '../model-edit-trips/model-edit-trips.component';
import { tripsDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-trips-table',
  templateUrl: './trips-table.component.html',
  styleUrls: ['./trips-table.component.scss'],
})
export class TripsTableComponent extends TableContainerComponent {
  @Input() fleetId!: string | null ;
  @Input() vehicleId!: string | number | null;
  @Input() driverId!: string | number | null;
  @Input() smallView = false;

  @Input() set addStrategy(v: Partial<Strategy>) {
    if(v) {
      this.strategy = {
        ...this.strategy,
        ...v,
      };
    }
  }

  @Output() submitted = new EventEmitter<any>();

  records!: TableInputDataInterface<TripsDataInterface>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private readonly appStateService: AppStateService,
    private readonly cdr: ChangeDetectorRef,
    private readonly tripsApiServices: TripsApiServices,
    private readonly fleetsApiService: FleetsApiService,
    private readonly modalCtrl: ModalController,
  ) {
    super(route, router, alertService, translocoService, notificationService);

    this.strategy = JSON.parse(JSON.stringify({
      ...tripsDataConfig,
    }));

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if(event) {
      this.currentEvent = event;

      this.currentEvent.filters = {
        ...this.currentEvent.filters && this.currentEvent.filters,
        ...this.fleetId && {
          fleetId: {
            value: this.fleetId,
            matchMode: '=',
            type: 'object-id',
          },
        },
        ...this.vehicleId && {
          vehicleId: {
            value: this.vehicleId,
            matchMode: '=',
            type: 'object-id',
          },
        },
        ...this.driverId && {
          driverId: {
            value: this.driverId,
            matchMode: '=',
            type: 'object-id',
          },
        },
      };
    }

    this.tripsApiServices.records(paramsFn(this.currentEvent))
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
          this.start = true;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        this.records = res;
        this.cdr.detectChanges();
      });

    this.tripsApiServices.status()
      .pipe(
        first(),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        this.strategy.columns.forEach((i) => {
          if(i.field === 'status') {
            i.options = res.data;
          }
        });
      });

    this.fleetsApiService.list()
        .pipe(
            first(),
            finalize(() => {
              this.cdr.detectChanges();
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

  info(row: any): void {
    // todo info logic
    // eslint-disable-next-line no-console
    console.log('info', row);
  }

  add(): void {
    const row: Partial<TripsDataInterface> = {
      ...this.fleetId && {
        fleetId: this.fleetId,
      },
      ...this.driverId && {
        driverId: this.driverId,
      },
      ...this.vehicleId && {
        vehicleId: this.vehicleId,
      },
    };

    this.onEditModal(this.fleetId ? row : null).then();
  }

  edit(row: PartialWithRequiredKey<TripsDataInterface, '_id'>): void {
    this.onEditModal(row).then();
  }

  changeActive(rows: TripsDataInterface[], event: boolean): void {
    // eslint-disable-next-line no-console
    console.error(rows, event);
  }

  override multiActionEvent($event: MultiActionEvent): any {
    const ids = $event.rows.map(row => ({ _id: row._id }));

    switch ($event.type) {
      case MultiActionEnum.SET_STATUS_ACCEPTED:
        return this.setStatusAccept(ids);
      case MultiActionEnum.SET_STATUS_PROGRESS:
        return this.setStatusProgress(ids);
      case MultiActionEnum.SET_STATUS_COMPLETED:
        return this.setStatusCompleted(ids);
      case MultiActionEnum.DELETE: {
        const names = $event.rows.map(row => row.name || row.label);

        const disabledNames = $event.rows
          .filter(row => ('isDeletable' in row) && !row.isDeletable)
          .map(row => `"${row.name}"`);

        const disabledNamesString = disabledNames.join(', ');

        return !disabledNamesString
          ? this.presentDeleteAlert(names, ids)
          : this.translate('errors.recordCannotBeDeleted', {
            count: disabledNames.length,
            records: disabledNamesString,
          })
            .subscribe((message)=> this.notificationService.error(message));
      }

      default:
        throw new Error('Invalid action type');
    }
  }

  delete(ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[]): void {
    this.tripsApiServices.deleteMany(ids)
      .pipe(
        first(),
      )
      .subscribe(trips => {
        this.translate('success.deletedTrip', {
          count: trips.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
        this.submitted.emit();
      });
  }

  override duplicate(row: any): void {
    this.onCloneModal(row).then();
  }

  async onEditModal(row: Partial<TripsDataInterface> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModelEditTripsComponent,
      cssClass: `w-${this.strategy.column}`,
      ...row && {
        componentProps: {
          data: row,
          readonlyFields: this.readonlyFields(),
        },
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if(data?.status === 'ok') {
      this.loadEvent();
      this.submitted.emit();
    }
  }

  async onCloneModal(row: PartialWithRequiredKey<TripsDataInterface, '_id'> | null = null): Promise<void> {
    const clone = this.translocoService.translate('global.clone');

    const modal = await this.modalCtrl.create({
      component: ModelEditTripsComponent,
      cssClass: `w-${this.strategy.column}`,
      ...row && {
        componentProps: {
          data: {
            name: `${row.name} ${clone}`,
            ...this.fleetId && {
              fleetId: this.fleetId,
            },
            ...this.driverId && {
              driverId: this.driverId,
            },
            ...this.vehicleId && {
              vehicleId: this.vehicleId,
            },
          },
          clone: true,
          _id: row._id,
        },
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if(data?.status === 'ok') {
      this.loadEvent();
      this.submitted.emit();
    }
  }

  private setStatusAccept(ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[]): void {
    this.tripsApiServices.setStatusAccept(ids)
      .pipe(
        first(),
      )
      .subscribe(trips => {
        this.translate('success.updatedTrip', {
          count: trips.data?.length,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
      });
  }

  private setStatusProgress(ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[]): void {
    this.tripsApiServices.setStatusProgress(ids)
      .pipe(
        first(),
      )
      .subscribe(trips => {
        this.translate('success.updatedTrip', {
          count: trips.data?.length,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
      });
  }

  private setStatusCompleted(ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[]): void {
    this.tripsApiServices.setStatusComplete(ids)
      .pipe(
        first(),
      )
      .subscribe(trips => {
        this.translate('success.updatedTrip', {
          count: trips.data?.length,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
      });
  }

  readonlyFields(): string[] {
    return [
      ...(this.fleetId ? ['fleetId'] : []),
      ...(this.vehicleId ? ['vehicleId'] : []),
      ...(this.driverId ? ['driverId'] : []),
    ];
  }
}
