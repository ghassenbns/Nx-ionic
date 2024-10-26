import { Component, Input, OnInit } from '@angular/core';
import {
  MeterInterface,
  MetersApiService,
  MeterSignalInterface,
  MetersSignalsApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import {
  CompSignalInterface,
  CompSignalsApiService,
  NodesViewApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  Column,
  EditTableContainerComponent,
  PartialWithRequiredKey,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { catchError, finalize, first, noop, tap, throwError } from 'rxjs';

import { defaultSignalsEditConfig } from '../signals-table/configs/default/editConfig';

@Component({
  selector: 'concordia-nx-ionic-signals-edit-table',
  templateUrl: './signals-edit-table.component.html',
  styleUrls: ['./signals-edit-table.component.scss'],
})
export class SignalsEditTableComponent extends EditTableContainerComponent<MeterSignalInterface> implements OnInit {
  @Input() override strategy: Strategy = JSON.parse(JSON.stringify(defaultSignalsEditConfig));

  @Input() meter?: MeterInterface;
  @Input() bulkAdd = false;
  private currentNodes: Set<string> = new Set();
  private currentTypes: Set<string> = new Set();

  constructor(navParams: NavParams,
              modalCtrl: ModalController,
              notificationService: UINotificationStateService,
              translocoService: TranslocoService,
              private readonly nodesViewApiService: NodesViewApiService,
              private readonly metersApiService: MetersApiService,
              private readonly metersSignalsApiService: MetersSignalsApiService,
              private readonly compSignalsApiService: CompSignalsApiService) {
    super(navParams, modalCtrl, translocoService, notificationService);
  }

  ngOnInit(): void {
    if (this.meter) {

      this.loading = {
        load_types: false,
        load_subTypes: false,
        load_nodes: false,
        load_compSignals: false,
        create: false,
        update: false,
        delete: false,
      };

      this.setData();
      this.selectedData.data.map((d: MeterSignalInterface) => d.nodeId && this.currentNodes.add(d.nodeId));
      this.loading.load_types = true;

      if (this.bulkAdd) {
        this.add();
      }
      this.metersApiService.signalsTypeList(this.meter)
        .pipe(
          first(),
          finalize(() => {
            this.loading.load_types = false;
            this.loadNodesList();
            //load signals for already selected nodes
            this.loadCompSignals();
          }),
        )
        .subscribe((res) => {
          res.data.map(d => this.currentTypes.add(d.signalType));

          const column = this.strategy.columns.find(c => c.field === 'signalType');
          if (column) {
            res.data = res.data.map(el => {
              el.name = this.translocoService.translate(`${column.translationPrefix}${el.signalType}`);
              return el;
            });
            this.setOption('signalType', res.data);
            res.data.map(t => this.currentTypes.add(t.signalType));
            this.selectedData.data.map((d: any) =>
              d.unitId = res.data.find(type => type.signalType === d.signalType)?.unitId);
          }
        });

      this.loading.load_subtypes = true;

      this.metersApiService.signalsSubtypeList(this.meter)
        .pipe(
          first(),
          finalize(() => {
            this.loading.load_subtypes = false;
          }),
        )
        .subscribe((res) => {
            const column = this.strategy.columns.find(c => c.field === 'signalSubtype');
            if (column) {
              res.data = res.data.map(el => {
                el.name = this.translocoService.translate(`${column.translationPrefix}${el.meterSignalSubtypeId}`);
                return el;
              });
              this.setOption('signalSubtype', res.data);
            }
          },
        );

    }
  }

  private loadNodesList(): void {
    this.loading.load_nodes = true;
    this.nodesViewApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_nodes = false;
        }),
      )
      .subscribe(res => {
        this.setOption('node', res.data);
      });
  }

  private loadCompSignals(nodeId = '', signalTypeId = ''): void {
    if (nodeId === null || this.currentNodes.has(nodeId)) {
      return;
    }

    const params = {
      nodeId: nodeId ? JSON.stringify([nodeId]) : JSON.stringify([...this.currentNodes]),
      meterSignalType: signalTypeId ? JSON.stringify([signalTypeId]) : JSON.stringify([...this.currentTypes]),
    };

    this.loading.load_compSignals = true;

    this.compSignalsApiService.list({ params: params })
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_compSignals = false;
          if (nodeId) {
            this.currentNodes.add(nodeId);
          }
          this.updateHidden();
        }),
      )
      .subscribe(res => {

        this.setOption('compSignal', res.data
          .map((k: CompSignalInterface) => ({
            ...k,
            nodeId: k.node._id,
            unitId: k.options?.unitId,
            hidden: nodeId ? false : this.currentData.some((e: any) => e.compSignalId === k.compSignalId),
          })), true);

        this.currentData.map(d => {
          const cs = res.data
            .find(signal => signal.compSignalId === d.compSignalId);
          d.unitId = cs && cs.options?.unitId;
        });

        this.selectedData.data.map((d: any) => {
          const cs = res.data
            .find(signal => signal.compSignalId === d.compSignalId);
          //do not refactor this assignment: we need to check if the row already has a
          //set comp signal to avoid setting the unitId to undefined
          if (cs) {
            d.unitId = cs.options?.unitId;
          }
        });
        this.updateHidden();
      });
  }

  override storeMany(newItem: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>[]): void {
    this.loading.create = true;
    const data = { '_id': this.meter?._id, signals: newItem };
    this.metersSignalsApiService.storeMany(data)
      .pipe(
        first(),
        finalize(() => {
          this.loading.create = false;
          this.closeModal();
        }),
        tap(signals => {
          const newSignals = this.parseSignalsFromResponse(signals);
          this.addMany(newSignals);

          this.translate('success.savedMeterSignals', {
            count: newSignals.length,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        }),
        catchError(err => {
          this.setError(err.error);

          return throwError(err);
        }),
      )
      .subscribe();
  }

  private parseSignalsFromResponse(signals: PartialWithRequiredKey<any, 'data'>): MeterSignalInterface[] {
    return signals.data.signals.map((signal: MeterSignalInterface) => {
      signal.unitId = this.currentData.find(d => (d.meterSignalId === signal.meterSignalId)
        || (d.uuid === signal.uuid))?.unitId;
      return signal;
    });

  }

  override editMany(newItem: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>[]): void {
    this.loading.update = true;
    const data = { '_id': this.meter?._id, signals: newItem };

    this.metersSignalsApiService.editMany(data)
      .pipe(
        first(),
        finalize(() => {
          this.loading.update = false;
          this.closeModal();
        }),
        tap(signals => {
          const updatedSignals = this.parseSignalsFromResponse(signals);
          this.updateMany(updatedSignals);

          this.translate('success.updatedMeterSignals', {
            count: updatedSignals.length,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        }),
        catchError(err => {
          this.setError(err.error);

          return throwError(err);
        }),
      ).subscribe();
  }

  override deleteMany(toBeDeleted: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>[]): void {
    this.loading.delete = true;
    const data: string[] = toBeDeleted.map(i => i.meterSignalId);

    this.metersSignalsApiService.deleteMany({ 'meterSignalId': data })
      .pipe(
        first(),
        finalize(() => {
          this.loading.delete = false;
          this.closeModal();
        }),
        tap(signals => {
          this.removeMany(data);

          this.translate('success.deletedMeterSignals', {
            count: signals.data,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        }),
        catchError(err => {
          this.setError(err.error);

          return throwError(err);
        }),
      ).subscribe();
  }

  override removeMany(items: string[]): void {
    this.selectedData = {
      data: this.selectedData.data.filter((j: any) => {
        return !items.some(t => t === j[this.entityKeyField]);
      }),
    };
  }

  changeValue(event: any): void {
    const column: Column | undefined =
      this.strategy.columns.find(c => c.field === event.field);
    const signalTypeColumn: Column | undefined =
      this.strategy.columns.find(c => c.field === 'signalType');
    switch (event.field) {
      case 'signalType':
        event.row.compSignalId = null;
        this.currentTypes.add(event.value);
        this.strategy.columns.map(c => {
          if (c.field === 'node') {
            c.disabled = !event.value;
          }
        });
        if (column) {
          const signalType = column.options.find(opt => opt.signalType === event.value);
          event.row.unitId = signalType?.unitId;
        }
        break;

      case 'node':
        //reset unitid to display signals
        if (signalTypeColumn) {
          event.row.compSignalId = null;
          const signalType = signalTypeColumn.options.find(opt => opt.signalType === event.row.signalType);
          event.row.unitId = signalType?.unitId;
        }

        this.strategy.columns.map(c => {
          if (c.field === 'compSignal') {
            c.disabled = !event.value;
          }
        });
        this.loadCompSignals(event.value);
        break;
      case 'compSignal':
        //update alias make other signals selecteable
        event.row.alias = this.strategy.columns
          .find(i => i.field === 'compSignal')?.options
          .find(o => o.compSignalId === event.value)?.name || '';

        this.updateHidden();
        break;
      default:
        noop();
    }

  }

  private currentMeterSignal(): MeterSignalInterface[] {
    const newRow = this.selectedData.data.filter((r: any) => !r.meterSignalId);

    return [
      ...this.currentData
        .map((signal: MeterSignalInterface) => {
          const r = this.selectedData.data.find((i: any) => i.meterSignalId === signal.meterSignalId);
          return r ? r : signal;
        })
        .filter((e: any) => !e.toBeDeleted),
      ...newRow && newRow,
    ];
  }

  override updateHidden(): void {
    this.strategy.columns.forEach(column => {
      if (column.field === 'compSignal') {
        const field = 'compSignalId';

        column.options.forEach(option => {
          option.hidden = this.currentMeterSignal()
            .some((r: any) => r[field] === option[field] && !r.toBeDeleted);
        });
      }
    });

    super.updateHidden();

  }

}
