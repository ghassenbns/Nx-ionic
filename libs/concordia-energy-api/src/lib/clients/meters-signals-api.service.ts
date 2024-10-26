import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientBaseService,
  ClientOptions,
  ConfigService,
} from '@concordia-nx-ionic/concordia-config';
import {
  HttpResponseEntityType,
  HttpResponseListType,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { Observable } from 'rxjs';

import { MeterInterface, MeterSignalInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MetersSignalsApiService extends ClientBaseService {
  readonly API_URL = '/energy/meters/signals';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  storeSignal(
    contract: PartialWithRequiredKey<MeterSignalInterface, 'meter'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<MeterSignalInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/store`, contract, _options);
  }

  updateSignal(
    meter: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<MeterSignalInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/update`, meter, _options);
  }

  delete(
    ids: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
      body: {
        meterSignalId: { ...ids.map(i => i.meterSignalId) },
      },
    };

    return this.deleteHttp(`${this.API_URL}/delete`, _options);
  }

  storeMany(signals: any,
            options: ClientOptions = {}): Observable<HttpResponseEntityType<{
    meter: MeterInterface,
    signals: MeterSignalInterface[]
  }>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/store`, signals, _options);
  }

  editMany(data: {
    signals: PartialWithRequiredKey<MeterSignalInterface, 'meterSignalId'>[];
    _id: string | undefined
  }, options: ClientOptions = {}): Observable<HttpResponseListType<MeterSignalInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/update`, data, _options);
  }

  deleteMany(data: PartialWithRequiredKey<any, 'meterSignalId'>, options: ClientOptions = {}):
    Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
      body: {
        ...data,
      },
    };

    return this.deleteHttp(`${this.API_URL}/delete`, _options);
  }
}
