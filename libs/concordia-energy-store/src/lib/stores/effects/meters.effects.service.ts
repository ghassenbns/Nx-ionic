import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MetersApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, tap } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { MeterActions } from '../actions';

@Injectable()
export class MetersEffectsService {
  handleMetersLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MeterActions.loadMeter,
      ),
      switchMap(({ id }) => {
        return this.metersApiService.show(id).pipe(
          switchMap(response => {
            const meter = response.data && Object.keys(response.data).length ? response.data : null;
            return [
              MeterActions.loadMeterSuccess(),
              MeterActions.addMeter({ meter: meter }),
            ];
          }),
          catchError(err => of(MeterActions.loadMeterFailure({ err }))),
        );
      }),
    ),
  );

  handleMetersUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MeterActions.updateMeter,
      ),
      switchMap(({ meter }) => {
        return [
          MeterActions.loadMeterSuccess(),
          MeterActions.addMeter({ meter: meter }),
        ];
      }),
    ),
  );

  handleMeterLatestTariffLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MeterActions.loadMeterLatestTariff,
      ),
      switchMap(({ id }) => {
        return this.metersApiService.getLatestTariffs(id).pipe(
          switchMap(response => {
            const tariff = response.data && Object.keys(response.data).length ? response.data : null;
            return [
              MeterActions.loadMeterLatestTariffSuccess(),
              MeterActions.addMeterLatestTariff({ id: id, tariff: tariff }),
            ];
          }),
          catchError(err => of(MeterActions.loadMeterLatestTariffFailure({ err }))),
        );
      }),
    ),
  );

  handleNavigateByUrl$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MeterActions.loadMeterFailure),
        tap(() => {
          this.router.navigateByUrl('/energy/meters').then();
        }),
      ),
    { dispatch: false },
  );

  handleMetersListParamLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MeterActions.loadMetersListParam,
      ),
      switchMap(({ viewAsUserId, meterIds = [] }) => {
        const p = {
          ...(viewAsUserId) && {
            viewAsUserId: viewAsUserId,
            ...meterIds && {
              filter: JSON.stringify(
                [{
                  scope: '_id',
                  type: 'object-id',
                  operator: 'in',
                  value: meterIds,
                }],
              ),
            },
          },
        };

        return this.metersApiService.list({ params: p }).pipe(
          switchMap(response => {
            const meters = response.data;

            return [
              MeterActions.loadMetersListParamSuccess(),
              MeterActions.addMetersListParam({ p: { viewAsUserId: viewAsUserId, meterIds: meterIds  }, meters }),
            ];
          }),
          catchError(err => of(MeterActions.loadMetersListParamFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly metersApiService: MetersApiService,
  ) {
  }
}
