import { Component, Input, OnInit } from '@angular/core';
import {
  MetersApiService, MeterSignalInterface,
  MetersSignalsApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import { CompSignalsApiService, NodesViewApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import {
  HttpResponseEntityType, HttpResponseListType,
  PartialWithRequiredKey,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, noop } from 'rxjs';

import { defaultSignalsEditConfig } from '../signals-table/configs/default/editConfig';

@Component({
  selector: 'concordia-nx-ionic-signals-edit-modal',
  templateUrl: './signals-edit-modal.component.html',
  styleUrls: ['./signals-edit-modal.component.scss'],
})
export class SignalsEditModalComponent implements OnInit {

  @Input() strategy: Strategy = JSON.parse(JSON.stringify(defaultSignalsEditConfig));
  loading = false;
  model: Partial<any> = {};
  readonlyFields: string[] = [];
  contractedPower: any[] = [];
  modalId = '';

  constructor(private readonly navParams: NavParams,
              private readonly modalCtrl: ModalController,
              private readonly translocoService: TranslocoService,
              private readonly notificationService: UINotificationStateService,
              private readonly nodesViewApiService: NodesViewApiService,
              private readonly metersApiService: MetersApiService,
              private readonly metersSignalsApiService: MetersSignalsApiService,
              private readonly compSignalsApiService: CompSignalsApiService) {
  }

  ngOnInit(): void {

    this.readonlyFields = this.navParams.get('readonlyFields');

    if ((this.navParams.data as any).data) {
      this.model = { ...(this.navParams.data as any).data };
      if (this.model['nodeId'] && this.model['signalType']) {
        this.getCompSignals(this.model['nodeId'], this.model['signalType']);
      }
    }

    if (this.navParams.get('modal')) {
      this.modalId = this.navParams.get('modal').id;
    }
    this.loading = true;

    this.nodesViewApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'node');
        if (temp) {
          temp.options = [...res.data];
        }
      });

    this.metersApiService.signalsTypeList(this.model['meter'])
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'signalType');
        if (temp) {
          temp.options = res.data.map(el => {
            el.name = this.translocoService.translate(`${temp.translationPrefix}${el.signalType}`);
           // el.group = this.translocoService.translate(`${temp.translationPrefix}${el.group}`);
            return el;
          });
        }
      });

    this.metersApiService.signalsSubtypeList(this.model['meter'])
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'signalSubtype');
        if (temp) {
          temp.options = res.data.map(el => {
            el.name = this.translocoService.translate(`${temp.translationPrefix}${el.meterSignalSubtypeId}`);
            return el;
          });
        }
      });

    this.nodesViewApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'node');
        if (temp) {
          temp.options = [...res.data];
        }
      });

  }

  edit(event: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>): void {
    if (this.model['meterId']) {
      event.meter = this.model['meter'];
    }
    const data = { ...event };
    this.metersSignalsApiService.updateSignal(data).pipe(
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

  cancel(data: HttpResponseEntityType<MeterSignalInterface>
    | HttpResponseListType<MeterSignalInterface>
    | null = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  store(event: PartialWithRequiredKey<MeterSignalInterface, 'meter'>): void {
    if (this.model['meter']) {
      event.meter = this.model['meter'];
    }

    this.metersSignalsApiService.storeSignal(event)
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

  changeValue(event: { value: any; rowSelector: string; form: any }): void {
    switch (event.rowSelector) {
      case 'signalType':
        this.model = {
          ...event.form,
          compSignalId: null,
          alias: null,
        };
        this.setCompSignals([]);
        if (event.form.nodeId) {
          this.getCompSignals(event.form.nodeId, event.value);
        }
        break;

      case 'nodeId':
        this.model = {
          ...event.form,
          compSignalId: null,
          alias: null,
        };
        this.setCompSignals([]);
        if (event.form.signalType) {
          this.getCompSignals(event.value, event.form.signalType);
        }
        break;
      case 'compSignalId':
        this.model = {
          ...event.form,
          alias: this.strategy.columns
            .find(i => i.field === 'compSignal')?.options
            .find(o => o.compSignalId === event.value)?.name || '',
        };
        break;
      default:
        noop();
    }
  }

  private setCompSignals(data: any[]): void {
    this.strategy.columns.forEach((i) => {
      if (i.field === 'compSignal') {
        i.options = data;
      }
    });
  }

  getCompSignals(nodeId: string, signalType: string | null = null): void {

    const params: any = { nodeId: nodeId };
    if (signalType) {
      params.meterSignalType = signalType;
    } else {
      params.meterSignalType = this.model['signalType'];
    }
    this.compSignalsApiService.list({ params: params })
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.setCompSignals(res.data);
      });
  }
}
