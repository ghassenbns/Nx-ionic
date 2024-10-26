import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientBaseService,
  ClientOptions,
  ConfigService,
} from '@concordia-nx-ionic/concordia-config';
import { HttpResponseEntityType } from '@concordia-nx-ionic/concordia-shared';
import { Observable } from 'rxjs';

import { MeterConsumptionComparisonInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MetersConsumptionComparisonApiService extends ClientBaseService {
  readonly API_URL = '/energy/meters';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  records(meterId: string, options: ClientOptions = {}):
    Observable<HttpResponseEntityType<MeterConsumptionComparisonInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/${meterId}/consumption/comparison`, _options);
  }
}
