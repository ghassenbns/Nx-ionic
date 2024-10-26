import { Component, OnInit } from '@angular/core';
import {
  CompSignalInterface,
  CompSignalsApiService,
  DriverDataInterface,
  NodesViewApiService,
  SignalInterface,
  VehicleInterface,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  EditTableContainerComponent,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, noop, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { signalsDataConfig } from '../signals-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-signals-table-edit',
  templateUrl: './modal-signals-table-edit.component.html',
  styleUrls: ['./modal-signals-table-edit.component.scss'],
})
export class ModalSignalsTableEditComponent extends EditTableContainerComponent<DriverDataInterface> implements OnInit {
  currentNodes: Set<string> = new Set();
  entity!: VehicleInterface;

  constructor(
    navParams: NavParams,
    modalCtrl: ModalController,
    notificationService: UINotificationStateService,
    translocoService: TranslocoService,
    private readonly vehiclesApiService: VehiclesApiService,
    private readonly nodeViewApiService: NodesViewApiService,
    private readonly compSignalsApiService: CompSignalsApiService,
  ) {
    super(navParams, modalCtrl, translocoService, notificationService);
  }

  ngOnInit(): void {
    this.strategy = JSON.parse(JSON.stringify(signalsDataConfig));

    if(this.navParams.get('entity')) {
      this.entity = { ...this.navParams.get('entity') };
    }

    this.loading = {
      load_nodes: false,
      load_signalType: false,
      load_compSignals: false,
      update: false,
    };

    this.setData();

    this.loading.load_signalType = true;
    this.vehiclesApiService.listSignalType()
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_signalType = false;
        }),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if(i.field === 'type') {
            i.options = res.data.map(j => ({
              ...j,
              hidden: this.entity.signalsConfig.some((e: any) => e.vehicleSignalTypeId === j.vehicleSignalTypeId),
            }));
          }
        });
      });

    this.loading.load_nodes = true;
    this.nodeViewApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_nodes = false;
        }),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if(i.field === 'node') {
            i.options = res.data;
          }
        });
      });

    this.currentNodes = new Set(this.entity?.signalsConfig.map((i: SignalInterface) => i.nodeId));

    this.loadCompSignals();
  }

  override duplicate(row: any): void {
    this.selectedData = {
      data: [
        ...this.selectedData.data,
        {
          ...row,
          _id: null,
          vehicleSignalTypeId: null,
          compSignalId: null,
          vehicleSignalTypeLabel: null,
          compSignalName: null,
          uuid: uuidv4(),
          status: 'new',
          error: '',
          changed: true,
        },
      ],
    };
  }

  override save(row: Partial<SignalInterface>[]): void {
    const newRow = row.filter(r => !r._id);

    const params = {
      _id: this.entity._id,
      signalsConfig: [
        ...this.entity.signalsConfig
          .map((e: any) => {
            const r = row.find(i => i._id === e._id);
            return r ? r : e;
          })
          .filter((e: any) => !e.toBeDeleted),
        ...newRow && newRow,
      ],
    };

    this.loading.update = true;

    this.vehiclesApiService
      .edit(params)
      .pipe(
        first(),
        finalize(() => {
          this.loading.update = false;
        }),
      )
      .subscribe(
        i => {
          this.onClose(i.data).then();

          this.translate('success.updatedVehicles', {
            count: 1,
          })
            .subscribe(message => {
              this.notificationService.success(message);
            });
        },
        ({ error }) => {
          this.setError(error);

          return throwError(error);
        },
      );

  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  storeMany(): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  editMany(): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deleteMany(): void {
  }

  changeValue(event: any): void {
    switch(event.rowSelector) {
      case 'type':
        return this.updateHidden();

      case 'node':
        event.row.alias = null;
        event.row.compSignalId = null;
        this.updateHidden();

        return this.loadCompSignals(event.value);

      case 'compSignal':
        event.row.alias = this.strategy.columns
          .find(i => i.field === 'compSignal')?.options
          .find(o => o.compSignalId === event.value)?.name || '';

        return this.updateHidden();

      default:
        return noop();
    }
  }

  private loadCompSignals(nodeId = ''): void {
    if(this.currentNodes.has(nodeId)) {
      return;
    }

    const params = {
      nodeId: nodeId ? JSON.stringify([nodeId]) : JSON.stringify([...this.currentNodes]),
    };

    this.loading.load_compSignals = true;

    this.compSignalsApiService.list({ params: params })
      .pipe(
        first(),
        finalize(() => {
          this.loading.load_compSignals = false;
        }),
      )
      .subscribe(res => {
        this.currentNodes.add(nodeId);

        this.setOption('compSignal', res.data
          .map((k: CompSignalInterface) => ({
            ...k,
            nodeId: k.node._id,
            hidden: nodeId ? false : this.entity.signalsConfig.some((e: any) => e.compSignalId === k.compSignalId),
          })), true);
      });
  }

  override updateHidden(): void {
    this.strategy.columns.forEach(column => {
      if(column.field === 'compSignal' || column.field === 'type') {
        const field = column.field === 'type' ? 'vehicleSignalTypeId': 'compSignalId';

        column.options.forEach(option => {
          option.hidden = this.currentSignal()
            .some((r: any) => r[field] === option[field] && !r.toBeDeleted);
        });
      }
    });

    super.updateHidden();

  }

  private currentSignal(): SignalInterface[] {
    const newRow = this.selectedData.data.filter((r: any) => !r._id);

    return [
      ...this.entity.signalsConfig
        .map((signal: SignalInterface) => {
          const r = this.selectedData.data.find((i: any) => i._id === signal._id);
          return r ? r : signal;
        })
        .filter((e: any) => !e.toBeDeleted),
      ...newRow && newRow,
    ];
  }

}
