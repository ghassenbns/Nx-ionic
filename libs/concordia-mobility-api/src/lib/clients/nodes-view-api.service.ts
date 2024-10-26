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

@Injectable({
  providedIn: 'root',
})

export class NodesViewApiService extends ClientBaseService {
  readonly API_URL = '/nodes/view';

  constructor(
    http: HttpClient,
    config: ConfigService,
  ) {
    super(http, config);
  }

  list(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/list`, _options);
  }
}
