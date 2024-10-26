import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientBaseService,
  ClientOptions,
  ConfigService,
} from '@concordia-nx-ionic/concordia-config';
import {
  HttpResponseListType,
} from '@concordia-nx-ionic/concordia-shared';
import { Observable } from 'rxjs';

import { TimezoneInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TimezoneApiService extends ClientBaseService {
  readonly API_URL = '/timezones';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<HttpResponseListType<TimezoneInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/list`, _options);
  }
}
