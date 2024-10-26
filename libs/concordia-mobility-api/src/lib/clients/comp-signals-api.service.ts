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

import { CompSignalInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})

export class CompSignalsApiService extends ClientBaseService {
  readonly API_URL = '/comp_signals/view';

  constructor(
    http: HttpClient,
    config: ConfigService,
  ) {
    super(http, config);
  }

  list(options: ClientOptions = {}): Observable<HttpResponseListType<CompSignalInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/list`, _options);
  }
}
