import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientOptions } from '@concordia-nx-ionic/concordia-config';
import {
  catchError,
  map,
  Observable,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

import { HttpResponseEntityType } from '../../interfaces';
import { ENTITY_API_SERVICE } from '../tokens/entity-service.token';

interface EntityApiService {
  show(id: string, options?: any): Observable<any>;
  edit(body: unknown, options?: ClientOptions): Observable<any>;
  // Add other required methods here
}

@Component({
  selector: 'concordia-ng-shared-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss'],
})
export class EntityDetailsComponent<T extends EntityApiService> {
  constructor(
    @Inject(ENTITY_API_SERVICE) private entityApiService: T,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}
  /**
   * Calls the entity details get endpoint and returns an observable
   * onErrorRedirectionPath : the redirection path when an error happens
   * @param {string} onErrorRedirectionPath
   * @return {*}  {Observable<any>}
   * @memberof EntityDetailsComponent
   */
  getEntityFromQueryId(onErrorRedirectionPath: string): Observable<any> {
    return this.activatedRoute.params.pipe(
      switchMap(params => {
        const id = params['id'];
        const options = { details: true };
        return this.entityApiService
          .show(id, { params: options })
          .pipe(map(res => res.data));
      }),
      catchError(error => {
        // Redirect user to fleets page
        this.router.navigate([onErrorRedirectionPath]);
        return throwError(() => error);
      }),
      shareReplay(1),
    );
  }

  editEntity(
    body: unknown,
    options: ClientOptions = {},
  ): Observable<HttpResponseEntityType<any>> {
    return this.entityApiService.edit(body, options);
  }
}
