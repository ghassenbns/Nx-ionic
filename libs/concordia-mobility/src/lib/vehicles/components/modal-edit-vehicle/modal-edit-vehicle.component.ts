import { Component, OnInit } from '@angular/core';
import {
  FleetsApiService,
  VehicleInterface,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { ModeEnum, PartialWithRequiredKey, Strategy } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, noop } from 'rxjs';

import { vehiclesDataConfig } from '../vehicles-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-edit-vehicle',
  templateUrl: './modal-edit-vehicle.component.html',
  styleUrls: ['./modal-edit-vehicle.component.scss'],
})
export class ModalEditVehicleComponent implements OnInit {
  strategy!: Strategy;
  loading = false;
  model: any = {};
  readonlyFields: string[] = [];

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly vehiclesApiService: VehiclesApiService,
    private readonly fleetsApiService: FleetsApiService,
    private readonly notificationService: UINotificationStateService,
  ) {}

  ngOnInit(): void {
    this.strategy = JSON.parse(JSON.stringify(vehiclesDataConfig));

    this.readonlyFields = this.navParams.get('readonlyFields');

    const data = this.navParams.get('data') ? JSON.parse(JSON.stringify(this.navParams.get('data'))) : {};

    this.model = {
      ...data,
      ...!data.batteryCapacity && {
        batteryCapacity: {
          value: 0,
          unit: null,
        },
      },
      ...!data.fuelTankCapacity && {
        fuelTankCapacity: {
          value: 0,
          unit: null,
        },
      },
      ...!data.gasTankCapacity && {
        gasTankCapacity: {
          value: 0,
          unit: null,
        },
      },
    };

    this.loading = true;

    this.fleetsApiService.list()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if (i.field === 'fleet') {
            i.options = res.data;
          }
        });
      });

    const fuelTypeHasEmptyOptions = this.strategy.columns.find(col =>col.field === 'fuelType' && !col.options.length);
    const typeHasEmptyOptions = this.strategy.columns.find(col =>col.field === 'type' && !col.options.length);

    if(typeHasEmptyOptions){
      this.fetchAndSetVehicleTypes();
    }

    if(fuelTypeHasEmptyOptions){
      this.fetchAndSetVehicleFuelTypes();
    }

    const defValue = this.strategy.columns.find(column => column.field === 'fuelType')?.defaultValue;

    if(this.model.vehicleFuelTypeId) {
      this.getFuelCapacityType(this.model.vehicleFuelTypeId);
    } else if (defValue){
      this.getFuelCapacityType(defValue);
    }
  }

  fetchAndSetVehicleTypes() : void {
    this.vehiclesApiService.listType()
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if (i.field === 'type') {
            i.options = res.data;
          }
        });
      });
  }

  fetchAndSetVehicleFuelTypes() : void {
    this.vehiclesApiService.listFuelType({ params: { capacities: true } })
    .subscribe(res => {
      this.strategy.columns.forEach(i => {
        if (i.field === 'fuelType') {
          i.options = res.data;
        }
      });
    });
  }

  cancel(data: unknown): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: any): void {
    const params = this.cleanParam(event);

    this.vehiclesApiService
      .edit(params)
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

  store(event: PartialWithRequiredKey<VehicleInterface, '_id'>): void {
    const params = this.cleanParam(event);

    this.vehiclesApiService
      .store(params)
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

  cleanParam(event: any): any {
    return {
      ...event,
      ...(event['fuelTankCapacity.value'] || event['fuelTankCapacity.value'] === 0) && {
        fuelTankCapacity:
          {
            unitId: this.model.fuelTankCapacity.unit.unitId,
            value: event['fuelTankCapacity.value'],
            vehicleFuelCapacityTypeId: 1,
          },
      },
      ...(event['gasTankCapacity.value'] || event['gasTankCapacity.value'] === 0) && {
        gasTankCapacity:
          {
            unitId: this.model.gasTankCapacity.unit.unitId,
            value: event['gasTankCapacity.value'],
            vehicleFuelCapacityTypeId: 2,
          },
      },
      ...(event['batteryCapacity.value'] || event['batteryCapacity.value'] === 0) && {
        batteryCapacity:
          {
            unitId: this.model.batteryCapacity.unit.unitId,
            value: event['batteryCapacity.value'],
            vehicleFuelCapacityTypeId: 3,
          },
      },
    };
  }

  changeValue(event: any): void {
    switch (event.rowSelector) {
      case 'vehicleFuelTypeId':
        this.getFuelCapacityType(event.value.detail.value, true);
        return noop();

      default:
        noop();
    }
  }

  showCapacity(capaciters: any[], clean = false, id = ''): void {
    if(capaciters) {
      if(clean) {
        const data = this.navParams.get('data');
        const isCurrentVehicleFuelTypeId: boolean = id === this.model.vehicleFuelTypeId;

        this.model.batteryCapacity.value = data?.batteryCapacity?.value && isCurrentVehicleFuelTypeId
          ? data.batteryCapacity.value : 0;

        this.model.fuelTankCapacity.value = data?.fuelTankCapacity?.value && isCurrentVehicleFuelTypeId
          ? data.fuelTankCapacity.value : 0;

        this.model.gasTankCapacity.value = data?.gasTankCapacity?.value && isCurrentVehicleFuelTypeId
          ? data.gasTankCapacity.value : 0;
      }

      this.strategy.columns.forEach((i) => {
        const mode = this.navParams.get('data') ? ModeEnum.SINGLE_EDIT : ModeEnum.SINGLE_CREATE;

        if(i.field === 'fuelTankCapacity' || i.field === 'gasTankCapacity' || i.field === 'batteryCapacity' ) {
          if(i.hidden && !i.hidden.includes(mode)){
            i.hidden.push(mode);
          }

          if(i.field === 'fuelTankCapacity' && capaciters.find((c: any) => c.vehicleFuelCapacityTypeId === i.id)) {
            i.hidden = i.hidden?.filter(h => h !== mode);

            this.model.fuelTankCapacity.unit = capaciters
              .find((c: any) => c.vehicleFuelCapacityTypeId === i.id).units[0];
          }

          if(i.field === 'gasTankCapacity' && capaciters.find((c: any) => c.vehicleFuelCapacityTypeId === i.id)) {
            i.hidden = i.hidden?.filter(h => h !== mode);

            this.model.gasTankCapacity.unit = capaciters
              .find((c: any) => c.vehicleFuelCapacityTypeId === i.id).units[0];
          }

          if(i.field === 'batteryCapacity' && capaciters.find((c: any) => c.vehicleFuelCapacityTypeId === i.id)) {
            i.hidden = i.hidden?.filter(h => h !== mode);

            this.model.batteryCapacity.unit = capaciters
              .find((c: any) => c.vehicleFuelCapacityTypeId === i.id).units[0];
          }
        }
      });
    }
  }

  getFuelCapacityType(id: string, clean = false): void {
    const params = {
      filter: JSON.stringify([{
        scope: 'vehicle_fuel_type_id',
        operator: '=',
        value: id,
        type: 'int',
      }]),
    };

    this.vehiclesApiService.listFuelCapacityType({ params: params })
      .subscribe((res) => {
        this.showCapacity(res.data, clean, id);
      });
  }
}
