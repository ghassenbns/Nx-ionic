import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientBaseService,
  ClientOptions,
  ConfigService,
} from '@concordia-nx-ionic/concordia-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ApiVersionService extends ClientBaseService {
  readonly API_URL = '/version';

  constructor(
    http: HttpClient,
    config: ConfigService,
  ) {
    super(http, config);
  }

  getApiVersion(options: ClientOptions = {}): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/semver`, _options);
  }
}
