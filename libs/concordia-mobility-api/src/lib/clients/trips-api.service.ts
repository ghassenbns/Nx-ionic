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
import { Observable } from 'rxjs';

import { LocationData, TripsDataInterface } from '../interfaces';
import { EventsInterface } from '../interfaces/eventsInterface';

@Injectable({
  providedIn: 'root',
})
export class TripsApiServices extends ClientBaseService {
  readonly API_URL = '/mobility/trips';
  readonly SINGLE_API_URL = '/mobility/trip';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<HttpResponseListType<TripsDataInterface>> {
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
  records(options: ClientOptions = {}): Observable<HttpRecordType<TripsDataInterface>> {
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
  show(_id: string, options: ClientOptions = {}): Observable<HttpResponseEntityType<TripsDataInterface>> {
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
    trips: PartialWithRequiredKey<TripsDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<TripsDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    // return this.post(this.SINGLE_API_URL, drivers, _options);
    return this.post(this.SINGLE_API_URL, trips, _options);
  }

 /*
 * store many drivers
 * [{description: string, name: string, managers?: number[]}]
 */
  storeMany(
    trips: PartialWithRequiredKey<TripsDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<TripsDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.API_URL, trips, _options);
  }

  /*
  * edit one driver
  * {_id: string, name: string}
  */
  edit(
    trips: PartialWithRequiredKey<TripsDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<TripsDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(`${this.API_URL}/${trips._id}`, trips, _options);
  }

  /*
  * delete many drivers
  * [{_id: string}]
  */
  deleteMany(
    ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[],
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
    trip: PartialWithRequiredKey<TripsDataInterface, '_id'>,
    options: ClientOptions = {},
    ) : Observable<HttpResponseEntityType<LocationData>> {
      const _options = {
        ...options,
        params: {
          ...options.params,
        },
      };

      return this.get(`${this.API_URL}/${trip._id}/last_position`, _options);
    }

  /*
  * status
  */
  status(options: ClientOptions = {}): Observable<HttpResponseListType<TripsDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/trip_statuses`, _options);
  }

  /*
   * statuses
   */
  statuses(id: string, options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}/trip_statuses`, _options);
  }

  /*
  * set Status Accept
  * [{_id: string}]
  */
  setStatusAccept(
    ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.patch(`${this.API_URL}/accept`, ids, _options);
  }

  /*
  * set Status Accept
  * [{_id: string}]
  */
  setStatusProgress(
    ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.patch(`${this.API_URL}/progress`, ids, _options);
  }

  /*
  * set Status Accept
  * [{_id: string}]
  */
  setStatusComplete(
    ids: PartialWithRequiredKey<TripsDataInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.patch(`${this.API_URL}/complete`, ids, _options);
  }

  /*
  * clone trip
  * PartialWithRequiredKey<TripsDataInterface, '_id'>
  */
  clone(
    id: string,
    trip: PartialWithRequiredKey<TripsDataInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/clone/${id}`, trip, _options);
  }

  /*
  * list Trip events
  */
  getEvents(
    id: string,
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
