import { Component, Input, OnInit } from '@angular/core';
import {
  MetersContractsApiService,
  SpainContractInterface,
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

import { spainContractsDataConfig } from '../spain-contracts-table/config';

@Component({
  selector: 'concordia-nx-ionic-spain-contracts-edit-modal',
  templateUrl: './spain-contracts-edit-modal.component.html',
  styleUrls: ['./spain-contracts-edit-modal.component.scss'],
})
export class SpainContractsEditModalComponent implements OnInit {
  @Input() strategy: Strategy = JSON.parse(JSON.stringify(spainContractsDataConfig));
  loading = false;
  model: Partial<any> = {};
  readonlyFields: string[] = [];
  contractedPower: any[] = [];
  modalId = '';
  energyPrice: any[] = [];

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
    this.loading = true;

    this.contractedPower = (this.model['contractedPower'] || [])
      .map((c: any) => ({
        value: c,
        uuid: uuidv4(),
      }));

    this.energyPrice = this.model['billingTypeId'] !== 'fija' ? [] : (this.model['energyPrice'] || [])
      .map((c: any) => ({
        value: c,
        uuid: uuidv4(),
      }));

    this.tariffsApiService.listSpainZones()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'zone');
        if (temp) {
          temp.options = [...res.data];
        }
      });

    this.tariffsApiService.listSpainSellers()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'seller');
        if (temp) {
          temp.options = [...res.data];
        }
      });

    this.tariffsApiService.listSpainDistributors()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
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

    this.tariffsApiService.listSpainTariffs()
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

    this.tariffsApiService.listSpainBillingTypes()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        const temp = this.strategy.columns.find(c => c.field === 'billingType');
        if (temp) {
          temp.options = [...res.data];
        }
      });
  }

  cancel(data: HttpResponseEntityType<SpainContractInterface>
    | HttpResponseListType<SpainContractInterface> | null = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: PartialWithRequiredKey<SpainContractInterface, 'meterContractId'>): void {
    if (this.model['meterId']) {
      event._id = this.model['meterId'];
    }
    const contractedPower = this.contractedPower.map(cp => cp.value);
    const energyPrice = this.energyPrice.map(cp => cp.value);

    const data = { ...event, contractedPower: contractedPower, energyPrice: energyPrice };
    this.metersContractsApiService.updateSpainContract(data).pipe(
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

  store(event: PartialWithRequiredKey<SpainContractInterface, '_id'>): void {
    if (this.model['meterId']) {
      event._id = this.model['meterId'];
    }
    const contractedPower = this.contractedPower.map(cp => cp.value);
    const energyPrice = this.energyPrice.map(cp => cp.value);

    const data = { ...event, contractedPower: contractedPower, energyPrice: energyPrice };
    this.metersContractsApiService.storeSpainContract(data)
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
      case 'tariffId':
        this.setContractedPowers(event);
        break;
      case 'billingTypeId':
        this.setEnergyPrices(event);
        break;

      default:
        noop();
    }

  }

  private setContractedPowers(tariffEvent: any): void {
    if (tariffEvent.value === '2.0TD') {
      this.contractedPower = this.contractedPower.length ? this.contractedPower.slice(0, 3) :
        [15, 15, 15].map(e => ({
          value: e,
          uuid: uuidv4(),
        }));
    } else {
      this.contractedPower = (this.contractedPower.length && this.contractedPower.length < 6) ?
        [...this.contractedPower.slice(0, 3), {
          value: 15,
          uuid: uuidv4(),
        }, {
          value: 15,
          uuid: uuidv4(),
        }, {
          value: 15,
          uuid: uuidv4(),
        }] : this.contractedPower;
    }
  }

  private setEnergyPrices(billingEvent: any): void {
    if (billingEvent.value === 'fija') {
      this.energyPrice = this.energyPrice.length ? this.energyPrice : [0, 0, 0, 0, 0, 0].map(e => ({
        value: e,
        uuid: uuidv4(),
      }));
    } else {
      this.energyPrice = [];
    }
  }

}
