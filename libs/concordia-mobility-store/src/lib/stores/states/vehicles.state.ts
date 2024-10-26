import { Injectable } from '@angular/core';
import { VehicleDataInterface, VehicleSignalTypeInterface } from '@concordia-nx-ionic/concordia-mobility-api';
import { TranslocoService } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { combineLatest, filter, find, first, map, noop, Observable } from 'rxjs';

import { VehiclesActions } from '../actions';
import * as fromTripsSelectors from '../selectors/trips.selectors';
import * as fromVehiclesSelectors from '../selectors/vehicles.selectors';

@Injectable()
export class VehicleStateService {
  constructor(
    private store: Store<never>,
    private readonly translocoService: TranslocoService,
  ) {
  }

  loadSignalTypes(id: string | number): void {
    this.store.pipe(select(fromVehiclesSelectors.selectVehiclesSignalTypes))
      .pipe(
        first(),
        find(i => !i[id]),
      )
      .subscribe((x) => {
        if (x) {
          this.store.dispatch(VehiclesActions.loadSignalTypes({
            id: id,
          }));
        }
      });
  }

  loadPosition(tripId: string, id: string | number,
               actualStartDate: number | null, actualEndDate: number | null, update: boolean): void {

    combineLatest([
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesPositions))
        .pipe(
          map(i => i[tripId]),
        ),
      this.store.pipe(select(fromTripsSelectors.selectTripsEntities))
        .pipe(
          map(i => i[tripId]),
        ),
    ])
      .pipe(
        first(),
      )
      .subscribe(([positions, obj]) => {
        if (!obj.vehicleDetails.positions || update) {
          const params = {
            filter: JSON.stringify([
              {
                scope: 'date',
                operator: '>=',
                value: positions?.endDate && update ? +positions?.endDate + 1 : actualStartDate,
                type: 'ts',
              },
              {
                scope: 'date',
                operator: '<=',
                value: actualEndDate,
                type: 'ts',
              },
            ]),
            ignorePagination: true,
          };

          this.store.dispatch(VehiclesActions.loadVehiclePositions({
            tripId: tripId,
            id: id,
            params: params,
            update: update,
          }));
        }
      });
  }

  loadEvents(tripId: string, id: string | number,
             actualStartDate: number | null, actualEndDate: number | null, update: boolean): void {

    combineLatest([
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesEvents))
        .pipe(
          map(i => i[tripId]),
        ),
      this.store.pipe(select(fromTripsSelectors.selectTripsEntities))
        .pipe(
          map(i => i[tripId]),
        ),
    ])
      .pipe(
        first(),
      )
      .subscribe(([events, obj]) => {
        if (!obj.vehicleDetails.events || update) {
          const params = {
            filter: JSON.stringify([
              {
                scope: 'date',
                operator: '>=',
                value: events?.endDate && update ? +events?.endDate + 1 : actualStartDate,
                type: 'ts',
              },
              {
                scope: 'date',
                operator: '<=',
                value: actualEndDate,
                type: 'ts',
              },
            ]),
            ignorePagination: true,
          };

          this.store.dispatch(VehiclesActions.loadVehicleEvents({
            tripId: tripId,
            id: id,
            params: params,
            update: update,
          }));
        }
      });
  }

  loadVehiclesDate(id: string, vehicleId: string | number,
                   actualStartDate: number | null, actualEndDate: number | null, value: number[],
                   tripStatusId: number): void {

    if (tripStatusId > 4) {
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesData))
        .pipe(
          first(),
          map((data) => data?.[id] || []),
        )
        .subscribe((obj: any[]) => {
          if (tripStatusId === 5) {
            const newValue = value
              .map(signalTypeId => ({
                signalTypeId,
                endDate: obj.find(o => o.vehicleSignalTypeId === signalTypeId)?.endDate,
              })).reduce((acc: any, key: any, currentIndex, currentArray) => {

                if(!key?.endDate || key?.endDate !== actualEndDate) {
                  if (acc[key.endDate]) {
                    acc[key.endDate].push(currentArray[currentIndex].signalTypeId);
                  } else {
                    acc[key.endDate] = [currentArray[currentIndex].signalTypeId];
                  }
                }

                return acc;
              }, {});

            Object.keys(newValue).forEach((key: any) => {
              this.loadDate(id, vehicleId,
                key && key !== 'undefined' ? +key + 1 : actualStartDate, actualEndDate,
                true, newValue[key]);
            });
          }

          if ([6, 7].includes(tripStatusId)) {

            const newValue = obj.length
              ? value?.filter((i: number) => !obj.find(o => o.vehicleSignalTypeId === i)) ?? [] : value;

            if (newValue.length) {
              this.loadDate(id, vehicleId, actualStartDate, actualEndDate, false, newValue);
            }
          }
        });
    }
  }

  loadDate(id: string, vehicleId: string | number,
           actualStartDate: number | null, actualEndDate: number | null, update: boolean,
           value: number[]): void {

    const params = {
      filter: JSON.stringify([
        { scope: 'date', operator: '>=', value: actualStartDate, type: 'ts' },
        { scope: 'date', operator: '<=', value: actualEndDate, type: 'ts' },
        { scope: 'vehicle_signal_type_id', operator: 'in', value: value, type: 'array' },
      ]),
      ignorePagination: true,
      decimation: 5000,
    };

    this.store.dispatch(VehiclesActions.loadVehicleData({
      id: id,
      value: value,
      vehicleId: vehicleId,
      params: params,
      update: update,
    }));
  }

  getFuelLevelGroups$(id: string | number | null | undefined): Observable<any> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesSignalTypes))
      .pipe(
        map(i => id ? i[id] : noop()),
      );
  }

  getSignalTypeGroups$(id: string | number | null | undefined): Observable<VehicleSignalTypeInterface[]> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesSignalTypes))
      .pipe(
        map(i => id ? i[id] : noop()),
      );
  }

  getTripData$(id: string, vehicleSignalTypeIds: number[]): Observable<VehicleDataInterface[]> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesData))
      .pipe(
        filter((vehiclesData) => !!Object.keys(vehiclesData).length),
        map((vehiclesData) => {
          return vehiclesData[id]?.filter((data: any) => vehicleSignalTypeIds.includes(data.vehicleSignalTypeId)) ?? [];
        }),
      );
  }

  getSignalTypesPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesSignalTypesLoadStatusPending));
  }

  getEventsPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesEventsLoadStatusPending));
  }

  getPositionsPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesPositionsLoadStatusPending));
  }

  getDataPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesDataLoadStatusPending));
  }

  getIdleTimeStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesIdleTimeStatusPending));
  }

  loadIdleTime(tripId: string, id: string | number,
               actualStartDate: number | null, actualEndDate: number | null, update: boolean): void {
    this.store.pipe(select(fromVehiclesSelectors.selectVehiclesIdleTime))
      .pipe(
        map(i => i[tripId]),
      )
      .pipe(
        first(),
      )
      .subscribe((events) => {
        if (!events || update) {
          const params = {
            filter: JSON.stringify([
              {
                scope: 'date',
                operator: '>=',
                value: actualStartDate,
                type: 'ts',
              },
              {
                scope: 'date',
                operator: '<=',
                value: actualEndDate,
                type: 'ts',
              },
            ]),
            ignorePagination: true,
          };

          this.store.dispatch(VehiclesActions.loadIdleTime({
            tripId: tripId,
            id: id,
            params: params,
            update: update,
          }));
        }
      });
  }

  getHarshEventsStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesHarshEventsStatusPending));
  }

  loadHarshEvents(tripId: string, id: string | number,
                  actualStartDate: number | null, actualEndDate: number | null, update: boolean): void {

    this.store.pipe(select(fromVehiclesSelectors.selectVehiclesHarshEvents))
      .pipe(
        map(i => i[tripId]),
        first(),
      )
      .subscribe((events) => {
        if (!events || update) {
          const params = {
            filter: JSON.stringify([
              {
                scope: 'date',
                operator: '>=',
                value: actualStartDate,
                type: 'ts',
              },
              {
                scope: 'date',
                operator: '<=',
                value: actualEndDate,
                type: 'ts',
              },
            ]),
            ignorePagination: true,
          };

          this.store.dispatch(VehiclesActions.loadHarshEvents({
            tripId: tripId,
            id: id,
            params: params,
            update: update,
          }));
        }
      });
  }

  getLongEventsStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromVehiclesSelectors.selectVehiclesLongEventsStatusPending));
  }

  loadLongEvents(tripId: string, id: string | number,
                 actualStartDate: number | null, actualEndDate: number | null, update: boolean): void {

    this.store.pipe(select(fromVehiclesSelectors.selectVehiclesLongEvents))
      .pipe(
        map(i => i[tripId]),
        first(),
      )
      .subscribe((events) => {
        if (!events || update) {
          const params = {
            filter: JSON.stringify([
              {
                scope: 'date',
                operator: '>=',
                value: actualStartDate,
                type: 'ts',
              },
              {
                scope: 'date',
                operator: '<=',
                value: actualEndDate,
                type: 'ts',
              },
            ]),
            ignorePagination: true,
          };

          this.store.dispatch(VehiclesActions.loadLongEvents({
            tripId: tripId,
            id: id,
            params: params,
            update: update,
          }));
        }
      });
  }

  getDurationSignals$(id: string | number | null | undefined): Observable<any> {
    return combineLatest([
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesLongEvents))
        .pipe(
          map(i => id ? i[id] : noop()),
          filter(i => !!i),
        ),
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesIdleTime))
        .pipe(
          map(i => id ? i[id] : noop()),
          filter(i => !!i),
        ),
    ])
      .pipe(
        map(([longEvents, idleTime]) => {
          const labels = longEvents.events
            .map((j: any) => this.translocoService.translate(`chart.${j.type}`));
          labels.unshift(this.translocoService.translate(`chart.${idleTime.type}`));

          const data = longEvents.events.map((j: any) => j.stats.count);
          data.unshift(idleTime.stats.count);

          return {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: '#FAB5C3',
              },
            ],
          };
        }),
      );
  }

  getCountSignals$(id: string | number | null | undefined): Observable<any> {
    return combineLatest([
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesHarshEvents))
        .pipe(
          map(i => id ? i[id] : noop()),
          filter(i => !!i),
        ),
      this.store.pipe(select(fromVehiclesSelectors.selectVehiclesIdleTime))
        .pipe(
          map(i => id ? i[id] : noop()),
          filter(i => !!i),
        ),
    ])
      .pipe(
        map(([harshEvents, idleTime]) => {

          const labels = harshEvents.events.map((j: any) => this.translocoService.translate(`chart.${j.type}`));
          labels.unshift(idleTime.excessiveIdleLabel);

          const data = harshEvents.events.map((j: any) => j.stats.count);
          data.unshift(idleTime.stats.excessiveIdleTimeCount);

          return {
            labels: labels,
            datasets: [
              {
                backgroundColor: '#FBD0A8',
                data: data,
              },
            ],
          };
        }),
      );
  }
}
