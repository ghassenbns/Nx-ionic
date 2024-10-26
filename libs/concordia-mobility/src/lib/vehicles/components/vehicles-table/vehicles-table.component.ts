import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import {
  FleetsApiService,
  VehicleInterface,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  AlertService,
  paramsFn,
  TableContainerComponent,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, tap } from 'rxjs';

import { ModalEditVehicleComponent } from '../modal-edit-vehicle/modal-edit-vehicle.component';
import { ModalVehiclesTableEditComponent } from '../modal-vehicles-table-edit/modal-vehicles-table-edit.component';
import { vehiclesDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-vehicles-table',
  templateUrl: './vehicles-table.component.html',
  styleUrls: ['./vehicles-table.component.scss'],
})
export class VehiclesTableComponent extends TableContainerComponent {
  @Input() fleetId!: string;
  @Output() submitted = new EventEmitter<any>();
  records: any | null = null;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private appStateService: AppStateService,
    private modalCtrl: ModalController,
    private vehiclesApiService: VehiclesApiService,
    private cdr: ChangeDetectorRef,
    private readonly fleetsApiService: FleetsApiService,
  ) {
    super(route, router, alertService, translocoService, notificationService);
    this.strategy = vehiclesDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);

    this.vehiclesApiService.listType()
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if (i.field === 'type') {
            i.options = res.data;
          }
        });
      });

    this.vehiclesApiService.listFuelType()
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if (i.field === 'fuelType') {
            i.options = res.data;
          }
        });
      });
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if (event) {
      this.currentEvent = event;

      if (this.fleetId) {
        const idFilter = {
          value: this.fleetId,
          matchMode: '=',
          type: 'object-id',
        };

        this.currentEvent.filters = {
          ...(this.currentEvent.filters && this.currentEvent.filters),
          fleetId: idFilter,
        };
      }
    }

    this.vehiclesApiService
      .records(paramsFn(this.currentEvent))
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
          this.start = true;
          this.cdr.detectChanges();
        }),
      )
      .subscribe(res => {
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

  info(row: VehicleInterface): void {
    // todo info logic
    // eslint-disable-next-line no-console
    console.log('info', row);
  }

  add(): void {
    const row: Partial<VehicleInterface> = {
      fleetId: this.fleetId,
    };

    this.onEditModal(this.fleetId ? row : null).then();
  }

  edit(row: VehicleInterface): void {
    this.onEditModal(row).then();
  }

  changeActive(rows: VehicleInterface[], event: boolean): void {
    const params = rows.map((row: VehicleInterface) => ({
      _id: row._id,
      isActive: event,
    }));

    this.vehiclesApiService
      .editMany(params)
      .pipe(
        first(),
        tap(() => this.loadEvent()),
      )
      .subscribe();
  }

  delete(ids: any[]): void {
    this.vehiclesApiService
      .deleteMany(ids)
      .pipe(first())
      .subscribe(vehicle => {
        this.translate('success.deletedVehicles', {
          count: vehicle.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
        this.submitted.emit();
      });
  }

  override multiEdit(rows: any[]): void {
    this.openEditModal(rows);
  }

  private async openEditModal(rows: any[]): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalVehiclesTableEditComponent,
      componentProps: { data: rows },
      cssClass: 'xl-modal',
    });
    modal.present();

    const data = await modal.onWillDismiss();

    if (data) {
      this.loadEvent();
      this.submitted.emit();
    }
  }

  private async onEditModal(
    row: Partial<VehicleInterface> | null = null,
  ): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalEditVehicleComponent,
      ...(row && {
        componentProps: {
          data: row,
          readonlyFields: [
            ...(this.fleetId ? ['fleetId'] : []),
          ],
        },
      }),
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.status === 'ok') {
      this.loadEvent();
      this.submitted.emit();
    }
  }
}
