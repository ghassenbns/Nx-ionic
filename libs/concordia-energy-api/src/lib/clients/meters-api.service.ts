import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientBaseService,
  ClientOptions,
  ConfigService,
} from '@concordia-nx-ionic/concordia-config';
import {
  HttpRecordType,
  HttpResponseEntityType,
  HttpResponseListType,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { Observable, of } from 'rxjs';

import { MeterTypes } from '../enums';
import {
  MeterInterface,
  MeterSignalInterface,
  MeterSignalSubtypeInterface,
  MeterSignalTypeInterface,
  SpainContractInterface,
} from '../interfaces';
import { TariffInterface } from '../interfaces';
import { PeruContractInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MetersApiService extends ClientBaseService {
  readonly API_URL = '/energy/meters';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<HttpResponseListType<MeterInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/list`, _options);
  }

  /*
   * records
   */
  records(options: ClientOptions = {}): Observable<HttpRecordType<MeterInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/records`, _options);
  }

  /*
   * setPublicMany (many)
   * { "_id" : string[], "is_public" : bolean }
   */
  setPublicMany(
    body: { _id: string[], isPublic: boolean },
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.patch(`${this.API_URL}/set_public`, body, _options);
  }

  /*
   * delete
   * [{signalType: string}]
   */
  deleteMany(
    ids: PartialWithRequiredKey<MeterInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
      body: {
        _id: { ...ids.map(i => i._id) },
      },
    };

    return this.deleteHttp(`${this.API_URL}/delete`, _options);
  }

  /*
  * store meter
  * [{description: string, name: string, managers?: number[]}]
  */
  store(
    meter: any,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<MeterInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/store`, meter, _options);
  }

  /*
  * update meter
  * [{description: string, name: string, managers?: number[]}]
  */
  update(
    meter: any,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<MeterInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(`${this.API_URL}/edit/update`, meter, _options);
  }

  /*
   * custom info types - list
   */
  listCustomInfoTypes(options: ClientOptions = {}): Observable<HttpResponseListType<MeterInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/custom_info_types/view/list`, _options);
  }

  /*
  * show
  * id: string
  */
  show(meterSignalTypeId: string, options: ClientOptions = {}): Observable<HttpResponseEntityType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/${meterSignalTypeId}`, _options);
  }

  /*
  * Latest Tariffs
  * id: string
  */
  getLatestTariffs(meterSignalTypeId: string, options: ClientOptions = {}):
    Observable<HttpResponseEntityType<TariffInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/${meterSignalTypeId}/latest_tariff`, _options);
  }

  /*
 * getMeterContractsRecords
 */
  spainContractRecords(meterSignalTypeId: string, options: ClientOptions = {}):
    Observable<HttpRecordType<SpainContractInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/${meterSignalTypeId}/contracts/records`, _options);
  }

  peruContractRecords(meterSignalTypeId: string, options: ClientOptions = {}):
    Observable<HttpRecordType<PeruContractInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/${meterSignalTypeId}/contracts/records`, _options);
  }

  /*
  * delete many
  * [{signalType: string}]
  */
  deleteManyContracts(
    ids: PartialWithRequiredKey<any, 'meterSignalTypeId'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
      body: {
        ...ids,
      },
    };

    return this.deleteHttp(this.API_URL, _options);
  }

  signalsRecords(meterSignalTypeId: string, options: ClientOptions = {}):
    Observable<HttpRecordType<MeterSignalInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };
    return this.get(`${this.API_URL}/view/${meterSignalTypeId}/signals/records`, _options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signalsTypeList(meter: MeterInterface, options: ClientOptions = {}): Observable<{
    data: MeterSignalTypeInterface[]
  }> {
    // const _options = {
    //   ...options,
    //   params: {
    //     ...options.params,
    //   },
    // };
    // return this.get(`${this.API_URL}/view/${signalType}/signals/records`, _options);
    let types: MeterSignalTypeInterface[] = [];
    switch (meter.meterType) {
      case MeterTypes.ELECTRICITY:
        types = [
          {
            'signalType': 'ae_15m',
            'name': 'signal_type_ae_15m',
            'group': 'group_ae',
            'unitId': 1472,
          },
          {
            'signalType': 'ae_15m_imported',
            'name': 'signal_type_ae_15m_imported',
            'group': 'group_ae',
            'unitId': 1472,
          },
          {
            'signalType': 'ae_15m_exported',
            'name': 'signal_type_ae_15m_exported',
            'group': 'group_ae',
            'unitId': 1472,

          },
          {
            'signalType': 're_15m_inductive',
            'name': 'signal_type_re_15m_inductive',
            'group': 'group_re',
            'unitId': 1493,

          },
          {
            'signalType': 're_15m_capacitive',
            'name': 'signal_type_re_15m_capacitive',
            'group': 'group_re',
            'unitId': 1493,

          }];
        break;
      case MeterTypes.HEAT:
        types = [
          {
            'signalType': 'heat_energy_MWh',
            'name': 'signal_type_heat_energy_MWh',
            'group': 'group_heat_energy',
            'unitId': 1471,

          },
          {
            'signalType': 'm3',
            'name': 'signal_type_heat_volume_m3',
            'group': 'group_heat_volume',
            'unitId': 179,

          },
          {
            'signalType': 'heat_power_kW',
            'name': 'signal_type_heat_power_kW',
            'group': 'group_heat_power',
            'unitId': 513,

          },
          {
            'signalType': 'flow_l_per_h',
            'name': 'signal_type_heat_flow_l_per_h',
            'group': 'group_heat_flow',
            'unitId': 1666,

          },
          {
            'signalType': 't1',
            'name': 'signal_type_heat_t1',
            'group': 'group_heat_temp',
            'unitId': 705,

          },
          {
            'signalType': 't2',
            'name': 'signal_type_heat_t2',
            'group': 'group_heat_temp',
            'unitId': 705,

          },
          {
            'signalType': 'delta_temp',
            'name': 'signal_type_heat_delta_temp',
            'group': 'group_heat_temp',
            'unitId': 705,

          },
          {
            'signalType': 'kv_temp',
            'name': 'signal_type_heat_kv_temp',
            'group': 'group_heat_temp',
            'unitId': 705,

          },
          {
            'signalType': 'heating_temp',
            'name': 'signal_type_heat_heating_temp',
            'group': 'group_heat_temp',
            'unitId': 705,

          },
          {
            'signalType': 'external_temp',
            'name': 'signal_type_heat_external_temp',
            'group': 'group_heat_temp',
            'unitId': 705,

          },
          {
            'signalType': 'operating_hours',
            'name': 'signal_type_heat_time_hours',
            'group': 'group_heat_time',
            'unitId': 1326,

          },
          {
            'signalType': 'p1_bar',
            'name': 'signal_type_heat_p1_bar',
            'group': 'group_heat_pressure',
            'unitId': 1645,

          },
          {
            'signalType': 'p2_bar',
            'name': 'signal_type_heat_p2_bar',
            'unitId': 1645,
            'group': 'group_heat_pressure',
          }];
        break;
      default:
        break;
    }
    return of({ data: types });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signalsSubtypeList(meter: MeterInterface, options: ClientOptions = {}): Observable<{
    data: MeterSignalSubtypeInterface[]
  }> {
    // const _options = {
    //   ...options,
    //   params: {
    //     ...options.params,
    //   },
    // };
    // return this.get(`${this.API_URL}/view/${signalType}/signals/records`, _options);
    let types: MeterSignalSubtypeInterface[] = [];
    switch (meter.meterType) {
      case MeterTypes.ELECTRICITY:
        types = [
          {
            'meterSignalSubtypeId': 'total',
            'name': 'subtype_total',
          },
          {
            'meterSignalSubtypeId': 'partial',
            'name': 'subtype_partial',
          },
          {
            'meterSignalSubtypeId': 'lighting',
            'name': 'subtype_lighting',
          },
          {
            'meterSignalSubtypeId': 'refrigeration',
            'name': 'subtype_refrigeration',
          },
          {
            'meterSignalSubtypeId': 'air_conditioning',
            'name': 'subtype_air_conditioning',
          },
          {
            'meterSignalSubtypeId': 'aux',
            'name': 'subtype_aux',
          },
          {
            'meterSignalSubtypeId': 'other',
            'name': 'subtype_other',
          },
        ];
        break;
      case MeterTypes.HEAT:
        types = [
          {
            'meterSignalSubtypeId': 'total',
            'name': 'subtype_total',
          },
          {
            'meterSignalSubtypeId': 'partial',
            'name': 'subtype_partial',
          }, {
            'meterSignalSubtypeId': 'other',
            'name': 'subtype_other',
          },
        ];
        break;
      default:
        break;
    }
    return of({ data: types });
  }
}
