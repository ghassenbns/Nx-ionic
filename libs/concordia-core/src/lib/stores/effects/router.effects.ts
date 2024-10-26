import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { RouterActions } from '../actions';

@Injectable()
export class RouterEffects {
  handleNavigateByUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.navigateByUrl),
        tap(({ url, extras }) => {
          this.router.navigateByUrl(url, {
            ...extras,
            replaceUrl: true,
          }).then();
        }),
      ) as any,
    { dispatch: false },
  );

  handleNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.navigate),
        tap(({ path, query, extras }) => {
          this.router.navigate(path, {
            queryParams: query,
            ...extras,
            replaceUrl: true,
          }).then();
        }),
      ) as any,
    { dispatch: false },
  );

  handleBack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.back),
        tap(() => {
          this.location.back();
        }),
      ),
    { dispatch: false },
  );

  handleForward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.forward),
        tap(() => {
          this.location.forward();
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
  ) {}
}
