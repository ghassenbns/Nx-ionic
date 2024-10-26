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
  HttpResponseListType, PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { Feature, Point } from 'geojson';
import { Observable } from 'rxjs';

import { DriverDataInterface } from '../interfaces';
import { EventsInterface } from '../interfaces/eventsInterface';

@Injectable({
  providedIn: 'root',
})
export class DriversApiService extends ClientBaseService {
  readonly API_URL = '/mobility/drivers';
  readonly SINGLE_API_URL = '/mobility/driver';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<HttpResponseListType<DriverDataInterface>> {
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
  records(options: ClientOptions = {}): Observable<HttpRecordType<DriverDataInterface>> {
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
  show(_id: string, options: ClientOptions = {}): Observable<HttpResponseEntityType<DriverDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${_id}`, _options);
  }

  /*
  * store many drivers
  * [{description: string, name: string, managers?: number[]}]
  */
  store(
    drivers: PartialWithRequiredKey<DriverDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<DriverDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.SINGLE_API_URL, drivers, _options);
  }

 /*
 * store many drivers
 * [{description: string, name: string, managers?: number[]}]
 */
  storeMany(
    drivers: PartialWithRequiredKey<DriverDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<DriverDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.API_URL, drivers, _options);
  }

  /*
  * edit one driver
  * {_id: string, name: string}
  */
  edit(
    driver: PartialWithRequiredKey<DriverDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<DriverDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(`${this.API_URL}/${driver._id}`, driver, _options);
  }

  /*
  * edit many drivers
  * [{_id: string, name: string}]
  */
  editMany(
    fleet: PartialWithRequiredKey<DriverDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(this.API_URL, fleet, _options);
  }

  /*
  * delete many drivers
  * [{_id: string}]
  */
  deleteMany(
    ids: PartialWithRequiredKey<DriverDataInterface, '_id'>[],
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

  getLastPosition(
    driver: PartialWithRequiredKey<DriverDataInterface, '_id'>,
    options: ClientOptions = {},
    ) : Observable<HttpResponseEntityType<Feature<Point, { timestamp : number }>>> {
      const _options = {
        ...options,
        params: {
          ...options.params,
        },
      };

      return this.get(`${this.API_URL}/${driver._id}/last_position`, _options);
    }

  /*
  * list driver events
  */
  getEvents(
    id: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<EventsInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}/events`, _options);
  }
}
