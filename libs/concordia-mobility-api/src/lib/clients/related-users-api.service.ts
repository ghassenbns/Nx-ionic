import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientBaseService,
  ClientOptions,
  ConfigService,
} from '@concordia-nx-ionic/concordia-config';
import { HttpResponseListType } from '@concordia-nx-ionic/concordia-shared';
import { Observable } from 'rxjs';

import { UserRelationInterface } from '../interfaces/users/userRelationInterface';

@Injectable({
  providedIn: 'root',
})
export class RelatedUsersApiService extends ClientBaseService {
  readonly FLEETS_API_URL = '/mobility/fleets';
  readonly DRIVERS_API_URL = '/mobility/drivers';
  constructor(http: HttpClient, config: ConfigService) {
    super(http, config);
  }

  /**
   * get list of legitimate users that can become fleet owners
   * @return {*}  {Observable<UserRelationDataModel>}
   * @memberof UsersApiService
   */
  listOwners(): Observable<HttpResponseListType<UserRelationInterface>> {
    return this.get(`${this.FLEETS_API_URL}/available_owners`);
  }

  /**
   * get managers list for the desired fleet
   * @param {string} fleetId
   * @return {*}  {Observable<UserRelationDataModel>}
   * @memberof UsersApiService
   */
  listManagersByFleet(
    fleetId: string | number,
    options: ClientOptions = {},
  ): Observable<HttpResponseListType<UserRelationInterface>> {
    const _options = {
      ...options,
      params: {
        ...options.params,
      },
    };

    return this.get(`${this.FLEETS_API_URL}/${fleetId}/available_managers`, _options);
  }

  /**
   *  Returns a list of basic users related with the current one
   * @return {*}  {Observable<HttpResponseListType<UserRelationModel>>}
   * @memberof RelatedUsersApiService
   */
  listBasicUsers(): Observable<HttpResponseListType<UserRelationInterface>> {
    return this.get(`${this.DRIVERS_API_URL}/available_users`);
  }

  /**
   * get users list for the drivers
   * @return {*}  {Observable<UserRelationDataModel>}
   * @memberof UsersApiService
   */
  listDriversUsers(
  ): Observable<HttpResponseListType<UserRelationInterface>> {
    return this.get(`/mobility/drivers/available_users`);
  }
}
