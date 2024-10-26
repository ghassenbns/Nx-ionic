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
import { Feature, Point } from 'geojson';
import { Observable } from 'rxjs';

import {
  PositionsInterface,
  VehicleDataInterface,
  VehicleEventsInterface,
  VehicleFuelCapacityTypes,
  VehicleFuelTypeDataInterface,
  VehicleIdleTimeInterface,
  VehicleInterface,
  VehicleSignalTypeInterface,
  VehicleTypeDataInterface,
} from '../interfaces';
import { EventsInterface } from '../interfaces/eventsInterface';

type VehicleId = Pick<VehicleInterface, '_id'>;

@Injectable({
  providedIn: 'root',
})

export class VehiclesApiService extends ClientBaseService {
  readonly API_URL = '/mobility/vehicles';
  readonly SINGLE_API_URL = '/mobility/vehicle';

  constructor(
    http: HttpClient,
    config: ConfigService,
  ) {
    super(http, config);
  }

  // list
  list(options: ClientOptions = {}): Observable<HttpResponseListType<VehicleInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(this.API_URL, _options);
  }

  // records
  records(
    options: ClientOptions = {},
  ): Observable<HttpRecordType<VehicleInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/records`, _options);
  }

  show(id: string, options: ClientOptions = {}): Observable<VehicleInterface> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}`, _options);
  }

  /*
   * store vehicles
   */
  store(
    vehicle: PartialWithRequiredKey<VehicleInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<VehicleInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.SINGLE_API_URL, vehicle, _options);
  }

  /*
   * store many vehicles
   */
  storeMany(
    vehicles: PartialWithRequiredKey<VehicleInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<VehicleInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(this.API_URL, vehicles, _options);
  }

  // edit
  edit(
    vehicle: PartialWithRequiredKey<VehicleInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<VehicleInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(`${this.API_URL}/${vehicle._id}`, vehicle, _options);
  }

  /*
   * edit many vehicles
   * [{_id: VehicleId, name: string}]
   */
  editMany(
    vehicles: PartialWithRequiredKey<VehicleInterface, '_id'>[],
    options: ClientOptions = {},
  ): Observable<HttpRecordType<VehicleInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(this.API_URL, vehicles, _options);
  }

  /*
   * delete many vehicles
   * [{_id: VehicleId}]
   */
  deleteMany(
    ids: VehicleId[],
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

  /*
   * list Vehicle Fuel Types
   */
  listFuelType(options: ClientOptions = {}): Observable<HttpResponseListType<VehicleFuelTypeDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/vehicle_fuel_types`, _options);
  }

  /*
   * list Vehicle Types
   */
  listType(options: ClientOptions = {}): Observable<HttpResponseListType<VehicleTypeDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/vehicle_types`, _options);
  }

/*
 * list Fuel Capacity Types
 */
  listFuelCapacityType(options: ClientOptions = {}): Observable<HttpResponseListType<VehicleFuelCapacityTypes>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/vehicle_fuel_capacity_types`, _options);
  }

  getLastPosition(
    vehicle: PartialWithRequiredKey<VehicleInterface, '_id'>,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<Feature<Point, { timestamp : number }>>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${vehicle._id}/last_position`, _options);
  }

  /*
  * list Vehicle Fuel Types
  */
  listSignalType(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/vehicle_signal_types`, _options);
  }

  /*
  * list Vehicles data
  */
  getDate(
    id: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<VehicleDataInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}/data`, _options);
  }

  /*
  * list Vehicles positions
  */
  getPositions(
      id: string | number,
      options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<PositionsInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}/positions`, _options);
  }

  /*
  * list Vehicle events
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

  getSignalTypes(
    id: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<VehicleSignalTypeInterface[]>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}/vehicle_signal_types/groups`, _options);
  }

  getIdleTime(
    id: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<VehicleIdleTimeInterface>> {
    const _options: any = {
      ...options,
      params: {
        ...options.params,
        count: true,
      },
    };

    return this.get(`${this.API_URL}/${id}/idle_time`, _options);
  }

  getLongEvents(
    id: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<VehicleEventsInterface>> {
    const _options: any = {
      ...options,
      params: {
        ...options.params,
        count: true,
      },
    };

    return this.get(`${this.API_URL}/${id}/long_events`, _options);
  }

  getHarshEvents(
    id: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<VehicleEventsInterface>> {
    const _options: any = {
      ...options,
      params: {
        ...options.params,
        count: true,
      },
    };

    return this.get(`${this.API_URL}/${id}/harsh_events`, _options);
  }
}
