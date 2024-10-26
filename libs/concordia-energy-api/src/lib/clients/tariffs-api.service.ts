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
export class TariffsApiService extends ClientBaseService {
  readonly API_URL = '/energy/tariffs';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  listSpainBillingTypes(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/spain/electricity/billing_types/view/list`, _options);
  }

  listSpainDistributors(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/spain/electricity/distributors/view/list`, _options);
  }

  listSpainTariffs(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
        fields: JSON.stringify(['tariff_id', 'name', 'group', 'periods']),
      },
    };

    return this.get(`${this.API_URL}/spain/electricity/view/list`, _options);
  }

  listSpainSellers(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/spain/electricity/sellers/view/list`, _options);
  }

  listSpainZones(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/spain/electricity/zones/view/list`, _options);
  }

  listPeruDepartments(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/peru/electricity/departments/view/list`, _options);
  }

  listPeruDistributors(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/peru/electricity/distributors/view/list`, _options);
  }

  listPeruTariffs(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
        fields: JSON.stringify(['tariff_id', 'name']),
      },
    };

    return this.get(`${this.API_URL}/peru/electricity/view/list`, _options);
  }

  listPeruConnections(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/peru/electricity/connection_types/view/list`, _options);
  }

  listPeruZones(options: ClientOptions = {}): Observable<HttpResponseListType<any>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/peru/electricity/zones/view/list`, _options);
  }
}
