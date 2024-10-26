/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { NavigationExtras, Params } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, shareReplay } from 'rxjs';

import { RouterActions } from '../actions';
import {
  selectRouteParam,
  selectRouteParams,
  selectRouteQueryParam,
  selectRouteQueryParams,
  selectRouteUrl,
} from '../selectors';

@Injectable()
export class RouterStateService {

  constructor(private store: Store<never>) {}

  getUrl$(): Observable<string> {
    return this.store.pipe(select(selectRouteUrl));
  }

  getParam$(paramName: string): Observable<string> {
    return this.store.pipe(select(selectRouteParam, { paramName })).pipe(
      shareReplay(),
    );
  }

  getParams$(): Observable<Params> {
    return this.store.pipe(select(selectRouteParams));
  }

  getQueryParam$(queryParamName: string): Observable<any> {
    return this.store.pipe(select(selectRouteQueryParam, { queryParamName }));
  }

  getQueryParams$(): Observable<Params> {
    return this.store.pipe(select(selectRouteQueryParams));
  }

  navigate(path: any[], query?: Params, extras?: NavigationExtras): void {
    this.store.dispatch(RouterActions.navigate({ path, query, extras }));
  }

  navigateByUrl(url: string, extras?: NavigationExtras): void {
    this.store.dispatch(RouterActions.navigateByUrl({ url, extras }));
  }

}
