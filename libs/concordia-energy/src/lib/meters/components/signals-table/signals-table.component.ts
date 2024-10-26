import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import {
  METER_COUNTRIES,
  MeterInterface,
  MetersApiService, MeterSignalInterface,
  MetersSignalsApiService,
  MeterTypes,
} from '@concordia-nx-ionic/concordia-energy-api';
import {
  AlertService, paramsFn, PartialWithRequiredKey,
  Strategy,
  TableContainerComponent,
  TableInputDataInterface,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first } from 'rxjs';

import { SignalsEditModalComponent } from '../signals-edit-modal/signals-edit-modal.component';
import { SignalsEditTableComponent } from '../signals-edit-table/signals-edit-table.component';
import { defaultSignalsEditConfig } from './configs/default/editConfig';
import { defaultSignalListConfig } from './configs/default/listConfig';
import { lithuaniaSignalsEditConfig } from './configs/lithuania/editConfig';
import { lithuaniaSignalsListConfig } from './configs/lithuania/listConfig';
import { peruSignalsEditConfig } from './configs/peru/editConfig';
import { peruSignalsListConfig } from './configs/peru/listConfig';

@Component({
  selector: 'concordia-nx-ionic-signals-table',
  templateUrl: './signals-table.component.html',
  styleUrls: ['./signals-table.component.scss'],
})
export class SignalsTableComponent extends TableContainerComponent implements OnInit {
  @Input() meter!: MeterInterface;
  @Output() submitted = new EventEmitter<any>();

  editStrategy!: Strategy;

  records!: TableInputDataInterface<any>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private readonly metersApiService: MetersApiService,
    private readonly metersSignalsApiService: MetersSignalsApiService
    ,
  ) {
    super(route, router, alertService, translocoService, notificationService);
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if (event) {
      this.currentEvent = event;
    }

    this.metersApiService.signalsRecords(this.meter._id, paramsFn(this.currentEvent))
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

    this.metersApiService.signalsTypeList(this.meter, paramsFn(this.currentEvent))
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
          this.start = true;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'signalType');
        if (temp) {
          temp.options = res.data.map(el => {
            el.name = this.translocoService.translate(`${temp.translationPrefix}${el.signalType}`);
            return el;
          });
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

    this.onEditModal({
      _id: this.meter._id, meter: this.meter,
    }).then();
  }

  edit(row: PartialWithRequiredKey<any, '_id'>): void {
    //add meter _id to form
    row._id = this.meter._id;
    this.onEditModal(row).then();
  }

  delete(ids: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>[]): void {
    this.metersSignalsApiService.delete(ids)
      .pipe(
        first(),
      )
      .subscribe(signals => {
        this.translate('success.deletedMeterSignals', {
          count: signals.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
        this.submitted.emit();
      });
  }

  override multiEdit(rows: any[]): void {
    this.openMultiEditModal(rows).then();
  }

  async openMultiEditModal(rows: any[]): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SignalsEditTableComponent,
      componentProps: {
        data: rows,
        readonlyFields: ['_id', 'meterSignalId'],
        meter: this.meter,
        entityKeyField: 'meterSignalId',
        bulkAdd: !rows.length,
        strategy: JSON.parse(JSON.stringify({ ...this.editStrategy })),
      },
      cssClass:
        'xl-modal',
    });
    modal.present();

    const data = await modal.onWillDismiss();

    if (data) {
      this.loadEvent();
      this.submitted.emit();
    }
  }

  async onEditModal(row: Partial<any> | null = null): Promise<void> {

    const modal = await this.modalCtrl.create({
      component: SignalsEditModalComponent,
      cssClass: `w-${this.strategy.column}`,
      ...row && {
        componentProps: {
          data: { ...row, meter: this.meter },
          readonlyFields: [
            ...(this.meter._id ? ['meterId'] : []),
          ],
          strategy: this.editStrategy,
        },
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.status === 'ok') {

      this.translate('success.updatedMeterSignals', {
        count: 1,
      })
        .subscribe(message => {
          this.notificationService.success(message);
        });

      this.loadEvent();
      this.submitted.emit();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override changeActive(rows: any[], event: boolean): void {
    throw new Error('Method not implemented.');
  }

  override ngOnInit(): void {
    this.setStrategies();
    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);
    super.ngOnInit();
  }

  private setStrategies(): void {
    switch (this.meter.country) {
      case METER_COUNTRIES.LITHUANIA:
        if (this.meter.meterType === MeterTypes.ELECTRICITY) {
          // eslint-disable-next-line no-console
          console.error(`${MeterTypes.ELECTRICITY} type not implemented for ${METER_COUNTRIES.LITHUANIA}`);
        } else {
          //table view strategy
          this.strategy = { ...lithuaniaSignalsListConfig };
          //modal edit strategy
          this.editStrategy = { ...lithuaniaSignalsEditConfig };
        }
        break;
      case METER_COUNTRIES.PERU:
        if (this.meter.meterType === MeterTypes.HEAT) {
          // eslint-disable-next-line no-console
          console.error(`${MeterTypes.HEAT} type not implemented for ${METER_COUNTRIES.PERU}`);
        } else {
          this.strategy = { ...peruSignalsListConfig };
          this.editStrategy = { ...peruSignalsEditConfig };
        }
        break;
      case METER_COUNTRIES.SPAIN:
        if (this.meter.meterType === MeterTypes.HEAT) {
          // eslint-disable-next-line no-console
          console.error(`${MeterTypes.HEAT} type not implemented for ${METER_COUNTRIES.SPAIN}`);
        } else {
          this.strategy = { ...defaultSignalListConfig };
          this.editStrategy = { ...defaultSignalsEditConfig };
        }
        break;
      default:
        break;
    }
  }
}
