import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HierarchiesApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { HierarchiesActions } from '../actions';

@Injectable()
export class HierarchiesEffectsService {
  handleHierarchiesListLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        HierarchiesActions.loadHierarchiesList,
      ),
      switchMap(() => {
        return this.hierarchiesApiService.list().pipe(
          switchMap(response => {
            return [
              HierarchiesActions.loadHierarchiesListSuccess({ list: response }),
            ];
          }),
          catchError(err => of(HierarchiesActions.loadHierarchiesListFailure({ err }))),
        );
      }),
    ),
  );

  handleHierarchiesLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        HierarchiesActions.loadHierarchies,
      ),
      switchMap(({ hierarchyId }) => {
        return this.hierarchiesApiService.show(hierarchyId, { params: { format: 'tree_view' } }).pipe(
          switchMap(response => {
            return [
              HierarchiesActions.loadHierarchiesSuccess(),
              HierarchiesActions.addHierarchies({ hierarchies: response }),
            ];
          }),
          catchError(err => of(HierarchiesActions.loadHierarchiesFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly hierarchiesApiService: HierarchiesApiService,
  ) {
  }
}
