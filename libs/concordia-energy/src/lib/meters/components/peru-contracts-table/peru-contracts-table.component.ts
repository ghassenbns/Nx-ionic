import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimezonesStateService } from '@concordia-nx-ionic/concordia-api-store';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import {
  MeterInterface,
  MetersApiService,
  MetersContractsApiService,
  PeruContractInterface,
  TariffsApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import {
  AlertService,
  paramsFn,
  PartialWithRequiredKey, TableContainerComponent,
  TableInputDataInterface,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first } from 'rxjs';

import { PeruContractsEditModalComponent } from '../peru-contracts-edit-modal/peru-contracts-edit-modal.component';
import { peruContractsDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-peru-contracts-table',
  templateUrl: './peru-contracts-table.component.html',
  styleUrls: ['./peru-contracts-table.component.scss'],
})
export class PeruContractsTableComponent extends TableContainerComponent {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override changeActive(rows: any[], event: boolean): void {
    throw new Error('Method not implemented.');
  }

  @Input() meter!: MeterInterface;
  @Output() submitted = new EventEmitter<any>();

  records!: TableInputDataInterface<PeruContractInterface>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private readonly tariffsApiService: TariffsApiService,
    private modalCtrl: ModalController,
    private readonly metersApiService: MetersApiService,
    private readonly metersContractsApiService: MetersContractsApiService,
    private readonly timezonesStateService: TimezonesStateService,
  ) {
    super(route, router, alertService, translocoService, notificationService);

    this.strategy = peruContractsDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if (event) {
      this.currentEvent = event;
    }
    this.timezonesStateService.loadTimezones();

    this.timezonesStateService.getTimezone(this.meter.timezoneId)
      .subscribe(data => {
        this.strategy.columns.forEach(i => {
          if (i.field === 'appliesFrom') {
            i.timezone = data?.shortName;
            // this.cdr.detectChanges();
          }
        });

      });
    this.metersApiService.peruContractRecords(this.meter._id, paramsFn(this.currentEvent))
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

    this.tariffsApiService.listPeruDepartments()
      .pipe(
        first(),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'department');
        if (temp) {
          temp.options = [...res.data];
        }
      });

    //slave wrt to Departments
    this.tariffsApiService.listPeruZones()
      .pipe(
        first(),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'zoneId');
        if (temp) {
//          temp.options = [...res.data.map(d => ({ 'zoneId': d.zoneId }))];
          temp.options = [...res.data];
        }
      });

    //slave wrt to zone
    this.tariffsApiService.listPeruTariffs()
      .pipe(
        first(),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'tariff');
        if (temp) {
          temp.options = [...res.data];
        }
      });

    this.tariffsApiService.listPeruDistributors()
      .pipe(
        first(),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'distributor');
        if (temp) {
          //uncomment to load less options and avoid recursion error
          //temp.options = [...res.data.slice(0, 100)];
          temp.options = [...res.data];
        }
      });

    this.tariffsApiService.listPeruConnections()
      .pipe(
        first(),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'connectionType');
        if (temp) {
          temp.options = [...res.data];
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(row: any): void {
    // // todo info logic
    // // eslint-disable-next-line no-console
    // console.log('info', row);
  }

  add(): void {
    this.onEditModal({ _id: this.meter._id }).then();
  }

  edit(row: PartialWithRequiredKey<any, '_id'>): void {
    //add meter _id to form
    row._id = this.meter._id;
    this.onEditModal(row).then();
  }

  delete(ids: PartialWithRequiredKey<PeruContractInterface, 'meterContractId'>[]): void {
    this.metersContractsApiService.delete(ids)
      .pipe(
        first(),
      )
      .subscribe(contracts => {
        this.translate('success.deletedContract', {
          count: contracts.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
        this.submitted.emit();
      });
  }

  override multiEdit(rows: any[]): void {
    this.openEditModal(rows).then();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async openEditModal(rows: any[]): Promise<void> {
    // const modal = await this.modalCtrl.create({
    //   component: ModalDriversTableEditComponent,
    //   componentProps: {
    //     data: rows,
    //     readonlyFields: [
    //       ...(this.fleetId ? ['fleetId'] : []),
    //     ],
    //   },
    //   cssClass: 'xl-modal',
    // });
    // modal.present();

    // const data = await modal.onWillDismiss();
    //
    // if(data) {
    //   this.loadEvent();
    //   this.submitted.emit();
    // }
  }

  async onEditModal(row: Partial<any> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: PeruContractsEditModalComponent,
      cssClass: `w-${this.strategy.column}`,
      ...row && {
        componentProps: {
          data: row,
          strategy: { ...this.strategy },
          readonlyFields: [
            ...(this.meter._id ? ['meterId'] : []),
          ],
        },
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.status === 'ok') {

      this.translate('success.updatedContract', {
        count: 1,
      })
        .subscribe(message => {
          this.notificationService.success(message);
        });

      this.loadEvent();
      this.submitted.emit();
    }
  }
}
