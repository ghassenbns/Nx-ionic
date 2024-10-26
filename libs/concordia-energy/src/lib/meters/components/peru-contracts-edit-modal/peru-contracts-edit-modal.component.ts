import { Component, Input, OnInit } from '@angular/core';
import {
  MetersContractsApiService,
  PeruContractInterface,
  TariffsApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import {
  HttpResponseEntityType,
  HttpResponseListType,
  PartialWithRequiredKey,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, noop } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { peruContractsDataConfig } from '../peru-contracts-table/config';

@Component({
  selector: 'concordia-nx-ionic-peru-contracts-edit-modal',
  templateUrl: './peru-contracts-edit-modal.component.html',
  styleUrls: ['./peru-contracts-edit-modal.component.scss'],
})
export class PeruContractsEditModalComponent implements OnInit {
  @Input() strategy: Strategy = JSON.parse(JSON.stringify(peruContractsDataConfig));
  loading = false;
  model: Partial<any> = {};
  readonlyFields: string[] = [];
  contractedPower: any[] = [];
  modalId = '';

  constructor(
    private readonly navParams: NavParams,
    private readonly modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly tariffsApiService: TariffsApiService,
    private readonly metersContractsApiService: MetersContractsApiService,
    private readonly notificationService: UINotificationStateService,
  ) {
  }

  ngOnInit(): void {

    this.readonlyFields = this.navParams.get('readonlyFields');

    if ((this.navParams.data as any).data) {
      this.model = { ...(this.navParams.data as any).data };

    }

    if (this.navParams.get('modal')) {
      this.modalId = this.navParams.get('modal').id;
    }

    // alert('Implement meter contract custom info');

    this.loading = true;

    this.contractedPower = (this.model['contractedPower'] || [15, 15, 15, 15, 15, 15])
      .map((c: any) => ({
        value: c || 15,
        uuid: uuidv4(),
      }));

    this.tariffsApiService.listPeruDepartments()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'department');
        if (temp) {
          temp.options = [...res.data];
        }
      });
    this.loadZones(this.model && this.model['departmentId']);
    this.loadTariff(this.model && this.model['zoneId']);
    this.tariffsApiService.listPeruConnections()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'connectionType');
        if (temp) {
          //uncomment to load less options and avoid recursion error
          //temp.options = [...res.data.slice(0, 100)];
          temp.options = [...res.data];
        }
      });

    this.tariffsApiService.listPeruDistributors()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'distributor');
        if (temp) {
          temp.options = [...res.data];
        }
      });
  }

  cancel(data: HttpResponseEntityType<PeruContractInterface>
    | HttpResponseListType<PeruContractInterface> | null = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: PartialWithRequiredKey<PeruContractInterface, 'meterContractId'>): void {
    if (this.model['meterId']) {
      event._id = this.model['meterId'];
    }
    const data = { ...event };
    this.metersContractsApiService.updatePeruContract(data).pipe(
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

  store(event: PartialWithRequiredKey<PeruContractInterface, '_id'>): void {
    if (this.model['meterId']) {
      event._id = this.model['meterId'];
    }
    const data = { ...event };
    this.metersContractsApiService.storePeruContract(data)
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

  changeValue(event: any): void {
    switch (event.rowSelector) {
      case 'departmentId':
        this.loadZones(event.value);
        break;
      case 'zoneId':

        this.loadTariff(event.value);
        break;

      default:
        noop();
    }

  }

  private loadZones(departmentId: string | null): void {
    const currentZones = this.strategy.columns.find(c => c.field === 'zoneId');
    if (currentZones) {
      currentZones.options = [];
    }
    if (departmentId) {

      this.tariffsApiService.listPeruZones({
        params: {
          'departmentId': departmentId,
        },
      })
        .pipe(
          first(),
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe((res) => {
          const temp = this.strategy.columns.find(c => c.field === 'zoneId');
          if (temp) {
            temp.options = [...res.data];
          }
        });
    }
  }

  private loadTariff(zoneId: string | null): void {
    const currentTariffs = this.strategy.columns.find(c => c.field === 'tariff');
    if (currentTariffs) {
      currentTariffs.options = [];
    }
    if (zoneId) {
      this.tariffsApiService.listPeruTariffs({ params: { 'zoneId': zoneId } })
        .pipe(
          first(),
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe((res) => {
          const temp = this.strategy.columns.find(c => c.field === 'tariff');
          if (temp) {
            temp.options = [...res.data];
          }
        });
    }
  }

}
