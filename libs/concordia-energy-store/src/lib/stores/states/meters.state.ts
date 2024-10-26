import { Injectable } from '@angular/core';
import { MeterInterface, TariffInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { select, Store } from '@ngrx/store';
import { filter, first, map, Observable } from 'rxjs';

import { MeterActions } from '../actions';
import * as fromMetersSelectors from '../selectors/meters.selectors';

@Injectable()
export class MetersStateService {
  constructor(private store: Store<never>) {
  }

  loadMeter(meterId: any): void {
    if (meterId) {
      this.store.pipe(select(fromMetersSelectors.selectMetersEntities))
        .pipe(
          first(),
          map(meters => meters[meterId]),
          filter(meter => !meter),
        )
        .subscribe(() => {
          this.store.dispatch(MeterActions.loadMeter({
            id: meterId,
          }));
        });
    }
  }

  setMeter(meter: any): void {
    this.store.dispatch(MeterActions.updateMeter({ meter: meter }));
  }

  getMeter(id: string): Observable<MeterInterface> {
    return this.store.pipe(select(fromMetersSelectors.selectMetersEntities)).pipe(
      map(i => i[id]),
    );
  }

  loadMeterLatestTariff(meterId: any): void {
    if (meterId) {
      this.store.pipe(select(fromMetersSelectors.selectMetersLatestTariffs))
        .pipe(
          first(),
          map(tariffs => tariffs[meterId]),
          filter(tariff => !tariff),
        )
        .subscribe(() => {
          this.store.dispatch(MeterActions.loadMeterLatestTariff({
            id: meterId,
          }));
        });
    }
  }

  getMeterLatestTariff(id: string): Observable<TariffInterface> {
    return this.store.pipe(select(fromMetersSelectors.selectMetersLatestTariffs)).pipe(
      map(i => i[id] || null),
    );
  }

  getPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromMetersSelectors.selectMeterLoadStatusPending));
  }

  getLatestTariffPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromMetersSelectors.selectMeterLatestTariffLoadStatusPending));
  }

  loadMeterList(param: any): void {
    if(param.viewAsUserId) {
      this.store.pipe(select(fromMetersSelectors.selectMetersList))
        .pipe(
          first(),
          map(meters => param.meterIds?.length
            ? meters[`${param.viewAsUserId}__${param.meterIds.join('_')}`]
            : meters[param.viewAsUserId]),
          filter(meters => !meters),
        )
        .subscribe(() => {
          this.store.dispatch(MeterActions.loadMetersListParam({
            ...param,
          }));
        });
    }
  }

  getMeterList(): Observable<any> {
    return this.store.pipe(select(fromMetersSelectors.selectMetersList));
  }
}
