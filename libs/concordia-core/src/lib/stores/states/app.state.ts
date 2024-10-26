import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { combineLatest, first, map, mapTo, Observable, take } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RightEnum } from '../../enum';
import { AppActions, UserActions } from '../actions';
import { selectAppError, selectScopes } from '../selectors';
import { RouterStateService } from './router.state';
import { ThemeService } from './theme.service';
import { UserStateService } from './user.state';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {

  constructor(
    private readonly store: Store<never>,
    private readonly userState: UserStateService,
    private readonly routerState: RouterStateService,
    private readonly oauthService: OAuthService,
    private readonly themeService: ThemeService,
  ) {
  }

  boot(): void {
    this.store.dispatch(AppActions.boot());
  }

  ready$(): Observable<boolean> {
    return combineLatest([
      this.userState.getUser$(),
    ]).pipe(
      filter(res => !!res[0]),
      take(1),
      mapTo(true),
    );
  }

  getError$(): Observable<HttpErrorResponse | null> {
    return this.store.pipe(select(selectAppError));
  }

  getScopes$(): Observable<string[]> {
    return this.store.pipe(select(selectScopes));
  }

  hasRight$(activity: RightEnum, path = '', parent = ''): Observable<boolean> {
    return this.store.pipe(select(selectScopes))
      .pipe(
        map(i => i.some(j => j.includes(`${activity}_all`)
          || j.includes(`${activity}_${path}`)
          || j.includes(`${activity}_${parent}_${path}`))),
      );
  }

  clean(endUrl = true): void {
    this.routerState.getUrl$().pipe(
      first(),
    ).subscribe(url => {
      this.routerState.navigate(['/auth/login'],
        {
          ...endUrl && {
            endUrl: url,
          },
        });
    });

    this.oauthService.logOut(true);
    this.store.dispatch(AppActions.clear());
    this.store.dispatch(UserActions.clear());
    this.themeService.setTheme();
  }
}
