import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientBaseService, ClientOptions, ConfigService } from '@concordia-nx-ionic/concordia-config';
import { HttpResponseListType } from '@concordia-nx-ionic/concordia-shared';
import { Observable } from 'rxjs';

import { UsersRelationshipsInterface } from '../interfaces/usersRelationshipsInterface';

@Injectable({
  providedIn: 'root',
})
export class UsersRelationshipsApiService extends ClientBaseService {
  readonly API_URL = '/users_relationships';

  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /*
   * list
   */
  list(options: ClientOptions = {}): Observable<HttpResponseListType<UsersRelationshipsInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.API_URL}/view/list`, _options);
  }

}
