import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import {
  DriverDataInterface,
  DriversApiService,
  FleetsApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  AlertService,
  paramsFn,
  PartialWithRequiredKey,
  TableContainerComponent,
  TableInputDataInterface,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, tap } from 'rxjs';

import { ModalDriversTableEditComponent } from '../modal-drivers-table-edit/modal-drivers-table-edit.component';
import { ModelEditDriverComponent } from '../model-edit-driver/model-edit-driver.component';
import { driverDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-drivers-table',
  templateUrl: './drivers-table.component.html',
  styleUrls: ['./drivers-table.component.scss'],
})
export class DriversTableComponent extends TableContainerComponent {
  @Input() fleetId!: string;
  @Output() submitted = new EventEmitter<any>();

  records!: TableInputDataInterface<DriverDataInterface>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private driversApiService: DriversApiService,
    private modalCtrl: ModalController,
    private readonly fleetsApiService: FleetsApiService,
  ) {
    super(route, router, alertService, translocoService, notificationService);

    this.strategy = driverDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if(event) {
      this.currentEvent = event;

      if (this.fleetId) {
        const idFilter = {
          value: this.fleetId,
          matchMode: '=',
          type: 'object-id',
        };

        this.currentEvent.filters = {
          ...this.currentEvent.filters && this.currentEvent.filters,
          fleetId: idFilter,
        };
      }
    }

    this.driversApiService.records(paramsFn(this.currentEvent))
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
    const row: Partial<DriverDataInterface> = {
      fleetId: this.fleetId,
    };

    this.onEditModal(this.fleetId ? row : null).then();
  }

  edit(row: PartialWithRequiredKey<DriverDataInterface, '_id'>): void {
    this.onEditModal(row).then();
  }

  changeActive(rows: DriverDataInterface[], event: boolean): void {
    const params = rows.map((row: DriverDataInterface) => ({
      _id: row._id,
      isActive: event,
    }));

    this.driversApiService.editMany(params)
      .pipe(
        first(),
        tap(() => this.loadEvent()),
      ).subscribe();
  }

  delete(ids: PartialWithRequiredKey<DriverDataInterface, '_id'>[]): void {
    this.driversApiService.deleteMany(ids)
      .pipe(
        first(),
      )
      .subscribe(drivers => {
        this.translate('success.deletedDriver', {
          count: drivers.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
        this.submitted.emit();
      });
  }

  override multiEdit(rows: DriverDataInterface[]): void {
    this.openEditModal(rows).then();
  }

  async openEditModal(rows: DriverDataInterface[]): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalDriversTableEditComponent,
      componentProps: {
        data: rows,
        readonlyFields: [
          ...(this.fleetId ? ['fleetId'] : []),
        ],
      },
      cssClass: 'xl-modal',
    });
    modal.present();

    const data = await modal.onWillDismiss();

    if(data) {
      this.loadEvent();
      this.submitted.emit();
    }
  }

  async onEditModal(row: Partial<DriverDataInterface> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModelEditDriverComponent,
      ...row && {
        componentProps: {
          data: row,
          readonlyFields: [
            ...(this.fleetId ? ['fleetId'] : []),
          ],
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
}
