import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientBaseService, ClientOptions, ConfigService } from '@concordia-nx-ionic/concordia-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserConfigService extends ClientBaseService {
  readonly API_URL = '/user_config';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
  * edit user Config
  * {_id: string, theme: string}
  */
  edit(
    userConfig: any,
    options: ClientOptions = {},
  ): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.post(`${this.API_URL}/edit/settings/update`, userConfig, _options);
  }

}
