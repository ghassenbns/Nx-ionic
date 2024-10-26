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
} from '@concordia-nx-ionic/concordia-shared';
import { map, Observable } from 'rxjs';

import {
  HierarchiesInterface,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class HierarchiesApiService extends ClientBaseService {
  readonly API_URL = '/energy/hierarchies';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<any[]> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/list`, _options)
      .pipe(
        map(d => d.data),
      );
  }

  /*
   * records
   */
  records(options: ClientOptions = {}): Observable<HttpRecordType<HierarchiesInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/records`, _options);
  }

  /*
   * delete Many
   * [{signalType: string}]
   */
  delete(
    id: string,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.deleteHttp(`${this.API_URL}/${id}`, _options);
  }

  /*
   * delete Many
   * [{signalType: string}]
   */
  deleteMany(
    ids: string[],
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<number>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
      body: ids,
    };

    return this.deleteHttp(`${this.API_URL}`, _options);
  }

  /*
  * store hierarchy
  * [{description: string, name: string, managers?: number[]}]
  */
  store(
    hierarchy: any,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}`, hierarchy, _options);
  }

  /*
  * update hierarchy
  * [{description: string, name: string, managers?: number[]}]
  */
  update(
    hierarchy: any,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<HierarchiesInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.put(`${this.API_URL}/${hierarchy._id}`, hierarchy, _options);
  }

  /*
  * show
  * id: string
  */
  show(id: string, options: ClientOptions = {}): Observable<HierarchiesInterface> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${id}`, _options).pipe(
      map(i => i.data),
    );
  }

  /*
  * set Public
  * id: string
  */
  setPublic(id: string | string[]): Observable<HttpResponseListType<HierarchiesInterface>> {
    return this.patch(`${this.API_URL}/set_public/${id}`, {});
  }

  /*
  * set Private
  * * id: string
  */
  setPrivate(id: string | string[]): Observable<HttpResponseListType<HierarchiesInterface>> {
    return this.patch(`${this.API_URL}/set_private/${id}`, {});
  }

  /*
  * set Public Many
  * ids: string[]
  */
  setPublicMany(ids: string[]): Observable<HttpResponseListType<HierarchiesInterface>> {
    return this.patch(`${this.API_URL}/set_public`, ids);
  }

  /*
  * set Private Many
  * ids: string[]
  */
  setPrivateMany(ids: string[]): Observable<HttpResponseListType<HierarchiesInterface>> {
    return this.patch(`${this.API_URL}/set_private`, ids);
  }

  /*
  * clone
  * id: string
  */
  clone(id: string, options: ClientOptions = {}): Observable<HierarchiesInterface> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/clone/${id}`, _options);
  }
}
