import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterStateService, UiStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  TripsDataInterface,
  VehicleDataInterface,
  VehicleSignalTypeInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  DriversStateService,
  TripStateService,
  VehicleStateService,
} from '@concordia-nx-ionic/concordia-mobility-store';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  Observable,
  of,
  shareReplay,
  skip,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-trips-analysis',
  templateUrl: './trips-analysis.component.html',
  styleUrls: ['./trips-analysis.component.scss'],
})
export class TripsAnalysisComponent implements OnInit, OnDestroy {
  id$!: Observable<string>;
  trip$!: Observable<TripsDataInterface>;
  vehiclesData$!: Observable<VehicleDataInterface[]>;
  vehiclesFuelLevelData$!: Observable<VehicleDataInterface[]>;
  format$!: Observable<string | null>;
  theme$!: Observable<string>;

  private _vehicleSignalTypeGroupName: BehaviorSubject<string> = new BehaviorSubject('SPEED_RPM_DATA');
  vehicleSignalTypeGroupName$: Observable<string> = this._vehicleSignalTypeGroupName.asObservable();

  vehiclesSignalTypeGroups$!: Observable<VehicleSignalTypeInterface[]>;
  vehiclesSignalTypeGroupsFiltered$!: Observable<VehicleSignalTypeInterface[]>;

  vehiclesCountSignals$!: Observable<any>;
  vehiclesDurationSignals$!: Observable<any>;

  isSummaryEventsData$!: Observable<boolean>;
  chartTime$!: Observable<number | null>;
  trajectoryTime$!: Observable<number | null>;
  zoomTime$!: Observable<number | null>;
  optionsHarshEvents: any;
  optionsLongEvents: any;

  loading$: Observable<boolean> = of(false);
  loadingSignalsData$: Observable<boolean> = of(false);
  loadingMapData$: Observable<boolean> = of(false);
  loadingCountOrDurationSignals$: Observable<boolean> = of(false);

  fuelLevelColors = [
    {
      backgroundColor: 'rgba(60, 179, 113, 0.5)',
      borderColor: 'rgba(60, 179, 113, 1)',
    },
  ];

  fuelLevelStats = {
    y: {
      min: 0,
      max: 100,
    },
  };

  mapLabels$: any = {};

  private newTrip$!: Observable<TripsDataInterface>;
  private destroy$ = new Subject<void>();
  private currentTripId = '';

  constructor(
    public readonly tripStateService: TripStateService,
    private readonly routerState: RouterStateService,
    private readonly userState: UserStateService,
    private readonly uiStateService: UiStateService,
    private readonly driversStateService: DriversStateService,
    private readonly vehicleStateService: VehicleStateService,
  ) {
  }

  ngOnInit(): void {
    this.format$ = this.userState.getDateTimeFormat$();
    this.theme$ = this.userState.getUserTheme$().pipe(
      tap(theme => this.setChartsOptions(theme)),
    );

    this.loading$ = this.tripStateService.getPendingStatus$();

    this.loadingSignalsData$ =
      combineLatest([
        this.loading$,
        this.vehicleStateService.getSignalTypesPendingStatus$(),
        this.vehicleStateService.getDataPendingStatus$(),
      ])
        .pipe(
          map(([trip, signalTypes, data]) =>
            trip || signalTypes || data),
        );

    this.loadingMapData$ =
      combineLatest([
        this.loading$,
        this.tripStateService.getEventsPendingStatus$(),
        this.driversStateService.getEventsPendingStatus$(),
        this.vehicleStateService.getEventsPendingStatus$(),
        this.vehicleStateService.getPositionsPendingStatus$(),
      ])
        .pipe(
          map(([trip, tripEvents, driverEvents, vehicleEvents, vehiclePositions]) =>
            trip || tripEvents || driverEvents || vehicleEvents || vehiclePositions),
          startWith(true),
        );

    this.loadingCountOrDurationSignals$ =
      combineLatest([
        this.loading$,
        this.vehicleStateService.getIdleTimeStatus$(),
        this.vehicleStateService.getHarshEventsStatus$(),
        this.vehicleStateService.getLongEventsStatus$(),
      ])
        .pipe(
          map(([trip, idleTime, harshEvents, longEvents]) =>
            trip || idleTime || harshEvents || longEvents ),
        );

    this.id$ = this.routerState.getParam$('id').pipe(
      takeUntil(this.destroy$),
      filter(id => !!id),
      distinctUntilChanged(),
      first(),
      tap(id => this.tripStateService.loadTrip(id)),
      shareReplay(),
    );

    this.trip$ = this.id$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      first(),
      switchMap((id) => this.tripStateService.getTrip(id)),
      takeUntil(this.destroy$),
      shareReplay(),
    );

    this.newTrip$ = this.trip$.pipe(
      filter(trip => !!trip && (!this.currentTripId || trip._id !== this.currentTripId)),
      tap(trip => this.currentTripId = trip._id),
      tap((trip: TripsDataInterface) => {
        if (trip.vehicleId) {
          this.vehicleStateService.loadSignalTypes(trip.vehicleId);
        }
      }),
      tap((trip: TripsDataInterface) => this.loadEvents(trip)),
      shareReplay(),
    );

    this.vehiclesSignalTypeGroups$ = this.newTrip$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      filter(trip => !!trip && !!trip.vehicleId),
      switchMap((trip) => this.vehicleStateService.getSignalTypeGroups$(trip.vehicleId)),
      takeUntil(this.destroy$),
      shareReplay(),
    );

    this.vehiclesSignalTypeGroupsFiltered$ = this.vehiclesSignalTypeGroups$
      .pipe(
        filter(i => !!i),
        map(j => j.filter((i: any) => i.name !== 'FUEL_ODOMETER_DATA')),
      );

    this.vehiclesCountSignals$ = this.newTrip$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      filter(trip => !!trip && !!trip.vehicleId),
      switchMap((trip) => this.vehicleStateService.getCountSignals$(trip._id)),
      takeUntil(this.destroy$),
      shareReplay(),
    );

    this.vehiclesDurationSignals$ = this.newTrip$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      filter(trip => !!trip && !!trip.vehicleId),
      switchMap((trip) => this.vehicleStateService.getDurationSignals$(trip._id)),
      takeUntil(this.destroy$),
      shareReplay(),
    );

    this.isSummaryEventsData$ = combineLatest([
      this.vehiclesCountSignals$,
      this.vehiclesDurationSignals$,
    ]).pipe(
        map(([count, duration]) => {
          return count || duration;
        }),
    );

    combineLatest([
      this.newTrip$,
      this.vehiclesSignalTypeGroups$,
    ]).pipe(
      takeUntil(this.destroy$),
      filter(([trip, ids]) => !!trip && !!ids),
      distinctUntilChanged(),
      first(),
      tap(([trip, group]) => {
        this.loadFuelAndSpeedVehiclesDate(trip, group);
      }),
      shareReplay(),
    ).subscribe( );

    combineLatest([
      this.newTrip$,
      this.vehicleSignalTypeGroupName$,
      this.vehiclesSignalTypeGroups$,
    ]).pipe(
      takeUntil(this.destroy$),
      filter(([trip, name, ids]) => !!trip && !!name && !!ids),
      distinctUntilChanged(),
      skip(1),
      debounceTime(500),
      tap(([trip, name, group]) => {
        this.loadFuelAndSpeedVehiclesDate(trip, group, name);
      }),
      shareReplay(),
    ).subscribe( );

    this.vehiclesData$ =
      combineLatest([
        this.trip$,
        this.vehicleSignalTypeGroupName$,
        this.vehiclesSignalTypeGroups$,
      ]).pipe(
        takeUntil(this.destroy$),
        filter(([trip, name, group]) => !!trip && !!name && !!group),
        switchMap(([trip, name, group]) => {
          const ids = group?.find(o => o.name === name)?.vehicleSignalTypeIds;

          return this.vehicleStateService.getTripData$(trip._id, ids ?? []);
        }),
      );

    this.vehiclesFuelLevelData$ =
      combineLatest([
        this.trip$,
        this.vehiclesSignalTypeGroups$,
      ]).pipe(
        takeUntil(this.destroy$),
        filter(([trip, group]) => !!trip && !!group),
        switchMap(([trip, group]) => {
          const ids = group?.find(o => o.name === 'FUEL_ODOMETER_DATA')?.vehicleSignalTypeIds;

          return this.vehicleStateService.getTripData$(trip._id, ids ?? []);
        }),
      );

    this.trajectoryTime$ = this.tripStateService.trajectoryTime;
    this.chartTime$ = this.tripStateService.chartTime;
    this.zoomTime$ = this.tripStateService.zoomTime;
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  onShowRightMenu(): void {
    this.uiStateService.toggleRightMenu();
  }

  onShowRightPanel(): void {
    this.uiStateService.toggleRightPanel();
  }

  changeSignalsTimeSeries(event: string): void {
    if (event) {
      this._vehicleSignalTypeGroupName.next(event);
    }
  }

  canChange(trip: TripsDataInterface | null | undefined): boolean {
    return trip?.tripStatusId !== 6 && trip?.tripStatusId !== 7;
  }

  reloadTrip(id: string | null | undefined): void {
    if(id) {
      this.tripStateService.loadTrip(id);
      this.currentTripId = '';
    }
  }

  loadEvents(trip: TripsDataInterface): void {
    if (trip.tripStatusId > 4 && trip.vehicleId && trip.driverId) {
      const actualEndDate = trip._endDate;

      this.tripStateService.loadEvents(trip._id, trip.tripStatusId === 5);

      this.vehicleStateService.loadPosition(trip._id, trip.vehicleId,
        trip.actualStartDate, actualEndDate, trip.tripStatusId === 5);

      this.vehicleStateService.loadEvents(trip._id, trip.vehicleId,
        trip.actualStartDate, actualEndDate, trip.tripStatusId === 5);

      this.driversStateService.loadEvents(trip._id, trip.driverId,
        trip.actualStartDate, actualEndDate, trip.tripStatusId === 5);

      this.vehicleStateService.loadIdleTime(trip._id, trip.vehicleId,
        trip.actualStartDate, actualEndDate, trip.tripStatusId === 5);

      this.vehicleStateService.loadHarshEvents(trip._id, trip.vehicleId,
        trip.actualStartDate, actualEndDate, trip.tripStatusId === 5);

      this.vehicleStateService.loadLongEvents(trip._id, trip.vehicleId,
        trip.actualStartDate, actualEndDate, trip.tripStatusId === 5);
    }
  }

  loadFuelAndSpeedVehiclesDate(trip: any, group: any, name = ''): void {
    const ids = group?.reduce((acc: any, key: any) => {
      if(key.name === 'FUEL_ODOMETER_DATA'
        || (key.name === 'SPEED_RPM_DATA' && !name)
        || key.name === name){
        key.vehicleSignalTypeIds.forEach((i: any) => acc.push(i));
      }

      return acc;
    }, []);

    if(ids?.length) {
      this.loadVehiclesDate(trip, ids);
    }
  }

  loadVehiclesDate(trip: TripsDataInterface, ids: number[]): void {
    if (trip?.vehicleId && trip.vehicleDetails && 'signalsConfig' in trip.vehicleDetails) {
      this.vehicleStateService.loadVehiclesDate(trip._id, trip.vehicleId, trip.actualStartDate, trip._endDate,
        ids, trip.tripStatusId);
    }
  }

  onReplayTimeChanged(event:number): void {
    if(typeof event === 'number') {
      this.tripStateService.toggleTrajectoryTime(event);
    }
  }

  onReplayZoomTime(event:number): void {
    if(typeof event === 'number') {
      this.tripStateService.toggleTrajectoryTime(event);
      this.tripStateService.toggleZoomTime(event);
    }
  }

  setChartsOptions(theme = 'light'): void{
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue(`--text-${theme}-color`);
    const surfaceBorder = documentStyle.getPropertyValue(`--border-${theme}-color`);

    this.optionsHarshEvents = {
      indexAxis: 'y',
      aspectRatio: 0.8,
      plugins: {
        legend: false,
        crosshair: false,
        title: {
          color: textColor,
          display: true,
          text: () => 'Driving behavioural alerts',
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColor,
            font: {
              size: 10,
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    this.optionsLongEvents = {
      indexAxis: 'y',
      aspectRatio: 0.8,
      plugins: {
        legend: false,
        crosshair: false,
        title: {
          color: textColor,
          display: true,
          text: () => 'Driving time characterization',
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColor,
            font: {
              size: 10,
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
