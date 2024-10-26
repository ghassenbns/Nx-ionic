import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import { SignalInterface, VehicleInterface, VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import {
  AlertService,
  TableContainerComponent,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first } from 'rxjs';

import { ModalEditSignalComponent } from '../modal-edit-signal/modal-edit-signal.component';
import { ModalSignalsTableEditComponent } from '../modal-signals-table-edit/modal-signals-table-edit.component';
import { signalsDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-signals-table',
  templateUrl: './signals-table.component.html',
  styleUrls: ['./signals-table.component.scss'],
})
export class SignalsTableComponent extends TableContainerComponent {
  _records!: SignalInterface[];
  @Input() set records(v: SignalInterface[]) {
    this._records = v;
    if(this._records) {
      this.setOption('type', [ ...new Set(this._records.map((r: SignalInterface) => r.vehicleSignalTypeLabel).sort())]);
      this.setOption('node', [ ...new Set(this._records.map((r: SignalInterface) => r.nodeName).sort())]);
    }
  }

  get records(): any {
    return this._records;
  }

  @Input() data!: VehicleInterface;
  @Output() changeValue = new EventEmitter<any>();

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private appStateService: AppStateService,
    private modalCtrl: ModalController,
    private vehiclesApiService: VehiclesApiService,
  ) {
    super(route, router, alertService, translocoService, notificationService);
    this.strategy = signalsDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);

  }

  add(): void {
    this.onEditModal().then();
  }

  edit(row: VehicleInterface): void {
    this.onEditModal(row).then();
  }

  override multiEdit(rows: VehicleInterface[]): void {
    this.openEditModal(rows).then();
  }

  async openEditModal(rows: VehicleInterface[]): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalSignalsTableEditComponent,
      componentProps: {
        data: rows,
        entity: this.data,
      },
      cssClass: 'xl-modal',
    });
    modal.present().then();

    const { data } = await modal.onWillDismiss();

    if(data) {
      this.changeValue.emit(data);
    }
  }

  delete(ids: any[]): void {
    const event = {
      _id: this.data._id,
      signalsConfig: [
        ...this.data.signalsConfig.filter(
          (s: any) => !ids.some(i => i._id === s._id),
        ),
      ],
    };

    this.vehiclesApiService
      .edit(event)
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(
        i => {
          this.changeValue.emit(i.data);

          this.translate('success.updatedVehicles', {
            count: 1,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        },
        ({ error }) => {
          this.notificationService.error(
            error.data.errors
              .map((i: any) =>
                'errorDetails' in i
                  ? i.errorDetails.join(' ')
                  : this.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
          );
        },
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeActive(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  info(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loadEvent(): void {}

  async onEditModal(
    row: VehicleInterface | null = null,
  ): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalEditSignalComponent,
      componentProps: {
        ...row && { data: row },
        entity: this.data,
      },
    });

    modal.present().then();

    const { data } = await modal.onWillDismiss();

    if (data?.status === 'ok') {
      this.changeValue.emit(data.data);
    }
  }
}
