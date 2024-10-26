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
import { Observable } from 'rxjs';

import { FleetDataInterface } from '../interfaces/fleetDataInterface';

@Injectable({
  providedIn: 'root',
})
export class FleetsApiService extends ClientBaseService {
  readonly API_URL = '/mobility/fleets';
  readonly SINGLE_API_URL = '/mobility/fleet';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<HttpResponseListType<FleetDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(this.API_URL, _options);
  }

  /*
   * records
   */
  records(options: ClientOptions = {}): Observable<HttpRecordType<FleetDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/records`, _options);
  }

  /*
   * show
   * id: string
   */
  show(id: string, options: ClientOptions = {}): Observable<HttpResponseEntityType<FleetDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}`, _options);
  }

  /*
   * store
   * [{description: string, name: string, managers?: number[]}]
   */
  store(
    fleet: PartialWithRequiredKey<FleetDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<FleetDataInterface> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.SINGLE_API_URL, fleet, _options);
  }

  /*
   * store Many
   * [{description: string, name: string, managers?: number[]}]
   */
  storeMany(
    fleets: PartialWithRequiredKey<FleetDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<FleetDataInterface> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.API_URL, fleets, _options);
  }

  /*
   * edit (one)
   * {_id: string, name: string}
   */
  edit(
    fleet: PartialWithRequiredKey<FleetDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<FleetDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(`${this.API_URL}/${fleet._id}`, fleet, _options);
  }

  /*
   * edit (many)
   * [{_id: string, name: string}]
   */
  editMany(
    fleet: PartialWithRequiredKey<FleetDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<FleetDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(this.API_URL, fleet, _options);
  }

  /*
   * delete
   * [{_id: string}]
   */
  deleteMany(
    ids: PartialWithRequiredKey<FleetDataInterface, '_id'>[],
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
}
