import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientBaseService, ClientOptions, ConfigService } from '@concordia-nx-ionic/concordia-config';
// import { HttpResponseEntityType } from '@concordia-nx-ionic/concordia-shared';
import { Observable } from 'rxjs';

// import { UserInterface } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ClientBaseService {
  readonly API_URL = '/users/me';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  getUser(options: ClientOptions = {}): Observable<any> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(this.API_URL, _options);
  }

}
