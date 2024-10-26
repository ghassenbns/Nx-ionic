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

import { PeruContractInterface, SpainContractInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MetersContractsApiService extends ClientBaseService {
  readonly API_URL = '/energy/meters/contracts';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * store contract
   */
  storeSpainContract(
    contract: PartialWithRequiredKey<SpainContractInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<SpainContractInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/store`, contract, _options);
  }

  /*
* update meter
* [{description: string, name: string, managers?: number[]}]
*/
  updateSpainContract(
    contract: PartialWithRequiredKey<SpainContractInterface, 'meterContractId'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<SpainContractInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/update`, contract, _options);
  }

  /*
 * delete
 * [{meterContractId: string}]
 */
  delete(
    ids: PartialWithRequiredKey<SpainContractInterface | PeruContractInterface, 'meterContractId'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
      body: {
        meterContractId: { ...ids.map(i => i.meterContractId) },
      },
    };

    return this.deleteHttp(`${this.API_URL}/delete`, _options);
  }

  /*
   * storePeruContract contract
   */
  storePeruContract(
    contract: PartialWithRequiredKey<PeruContractInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<PeruContractInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/store`, contract, _options);
  }

  /*
* updatePeruContract meter
* [{description: string, name: string, managers?: number[]}]
*/
  updatePeruContract(
    contract: PartialWithRequiredKey<PeruContractInterface, 'meterContractId'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<PeruContractInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/update`, contract, _options);
  }

}
