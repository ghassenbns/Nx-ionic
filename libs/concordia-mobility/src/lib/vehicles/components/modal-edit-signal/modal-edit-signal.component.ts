import { Component, OnInit } from '@angular/core';
import {
  CompSignalsApiService,
  NodesViewApiService,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { Strategy } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, noop } from 'rxjs';

import { signalsDataConfig } from '../signals-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-edit-signal',
  templateUrl: './modal-edit-signal.component.html',
  styleUrls: ['./modal-edit-signal.component.scss'],
})
export class ModalEditSignalComponent implements OnInit {
  strategy: Strategy = JSON.parse(JSON.stringify(signalsDataConfig));
  loading = false;
  model: any = {};
  entity: any = {};

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private vehiclesApiService: VehiclesApiService,
    private nodeViewApiService: NodesViewApiService,
    private compSignalsApiService: CompSignalsApiService,
    private readonly translocoService: TranslocoService,
    private readonly notificationService: UINotificationStateService,
  ) {
  }

  ngOnInit(): void {
    if(this.navParams.get('data')){
      this.model = { ...this.navParams.get('data') };

      if(this.model.nodeId) {
        this.getCompSignals(this.model.nodeId);
      }
    }

    if(this.navParams.get('entity')){
      this.entity = { ...this.navParams.get('entity') };
    }

    this.vehiclesApiService.listSignalType()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if (i.field === 'type') {
            i.options = res.data.map(j => ({
              ...j,
              hidden: this.entity.signalsConfig.some((e: any) => e.vehicleSignalTypeId === j.vehicleSignalTypeId ),
            }));
          }
        });
      });

    this.nodeViewApiService.list({ params: { includeCompSignals: 0 } })
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if(i.field === 'node') {
            i.options = res.data;
          }
        });
      });
  }

  cancel(data: unknown): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit($event: any): void {
    const event = {
      _id: this.entity._id,
      signalsConfig: [
        ...this.entity.signalsConfig.map(
          (s: any) => s._id === $event._id
            ? $event
            : s,
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
        i => this.cancel(i).then(),
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

  store($event: any): void {
    const event = {
      _id: this.entity._id,
      signalsConfig: [
        ...this.entity.signalsConfig,
        { ...$event },
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
        i => this.cancel(i).then(),
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

  changeValue(event: any): void {
    switch (event.rowSelector) {
      case 'nodeId':
        this.model = {
          ...event.form,
          compSignalId: null,
          alias: null,
        };

        return this.getCompSignals(event.value);

      case 'compSignalId':
        this.model = {
          ...event.form,
          alias: this.strategy.columns
            .find(i => i.field === 'compSignal')?.options
            .find(o => o.compSignalId === event.value)?.name || '',
        };

        return noop();

      default:
        return noop();
    }

  }

  getCompSignals(id: string): void {
    this.compSignalsApiService.list({ params: { nodeId: id } })
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.strategy.columns.forEach((i) => {
          if(i.field === 'compSignal') {
            i.options = res.data.map(j => ({
              ...j,
              hidden: this.entity.signalsConfig.some((e: any) => e.compSignalId === j.compSignalId ),
            }));
          }
        });
      });
  }

}
