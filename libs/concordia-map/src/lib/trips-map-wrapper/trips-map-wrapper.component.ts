import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { UiStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { TripsDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';
import { TRIPS_MAP_ELEMENT } from '@concordia-nx-ionic/concordia-shared';
import { TranslocoService } from '@ngneat/transloco';
import { Feature, Point } from 'geojson';
import { combineLatest, Observable, skip, Subscription } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-trips-map',
  templateUrl: './trips-map-wrapper.component.html',
  styleUrls: ['./trips-map-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripsMapWrapperComponent implements OnInit, OnDestroy {

  @ViewChild('concordiaTripMap') concordiaTripMap!: ElementRef;

  @Input() trip !: TripsDataInterface[];
  @Input() vehicleStyle = [];
  @Input() historicalColor = [54, 54, 54, 255];
  @Input() realtimeColor = [54, 54, 54, 255];
  @Input() isRealtime = false;
  @Input() enableRealtimeControl = true;
  @Input() mapLabels: any;

  @Input() set time(t: number | null) {
    if (t) {
      this.setTimestamp(t);
    }
  }

  @Output() replayTimeChanged = new EventEmitter<number>();
  @Output() loaded = new EventEmitter<boolean>();

  @Output() tripEventClicked = new EventEmitter<Feature<Point>>();
  @Output() driverEventClicked = new EventEmitter<Feature<Point>>();
  @Output() vehicleEventClicked = new EventEmitter<Feature<Point>>();
  @Output() waypointClicked = new EventEmitter<Feature<Point>>();

  renderIt = true;
  mapOptions = {};
  symbolLayerPaint: any = {};

  private themeSubscription$!: Subscription;
  private theme$!: Observable<string>;
  private subscription = new Subscription();

  constructor(
    @Inject(TRIPS_MAP_ELEMENT) private defineCustomElement: () => void,
    private config: ConfigService,
    private readonly uiState: UiStateService,
    private readonly translocoService: TranslocoService,
    private readonly userService: UserStateService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.initializeCustomElement();

    this.subscription.add(
      combineLatest([
        this.uiState.showRightPanel(),
        this.uiState.showMenu(),
      ])
        .pipe(
          skip(1),
        )
        .subscribe(() => {
          this.resizeMap();
        }),
    );

    this.theme$ = this.userService.getUserTheme$();
    this.themeSubscription$ = this.theme$
      .subscribe((theme) => {
        this.renderIt = false;
        this.cdr.detectChanges();
        this.mapOptions = this.initializeMapOptions(theme);
        this.renderIt = true;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.themeSubscription$.unsubscribe();
  }

  private initializeMapOptions(theme: string): any {
    return {
      style: this.config.getMapStyle(theme),
      cooperativeGestures: {
        windowsHelpText: this.translocoService.translate(`map.cooperativeGestures.windowsHelpText`),
        macHelpText: this.translocoService.translate(`map.cooperativeGestures.macHelpText`),
        mobileHelpText: this.translocoService.translate(`map.cooperativeGestures.mobileHelpText`),
      },
    };
  }

  private initializeCustomElement(): void {
    this.defineCustomElement();
  }

  setTimestamp(timestamp: number): void {
    this.concordiaTripMap?.nativeElement.setReplayTimestamp(timestamp);
  }

  resizeMap(): void {

    setTimeout(() => {
      this.concordiaTripMap?.nativeElement.resize();
    }, 800);
  }

  private emitFeatureEvent(ev: Event, emitter: EventEmitter<Feature<Point>>): void {
    const feature = (<CustomEvent<Feature<Point>>>ev).detail;
    emitter.emit(feature);
  }

  onLoaded(ev: Event): void {
    this.loaded.emit((<CustomEvent<boolean>>ev).detail);
  }

  onTripEventClick(ev: Event): void {
    this.emitFeatureEvent(ev, this.tripEventClicked);
  }

  onDriverEventClick(ev: Event): void {
    this.emitFeatureEvent(ev, this.driverEventClicked);
  }

  onVehicleEventClick(ev: Event): void {
    this.emitFeatureEvent(ev, this.vehicleEventClicked);
  }

  onWaypointClick(ev: Event): void {
    this.emitFeatureEvent(ev, this.waypointClicked);
  }

  onReplayTimeChanged(ev: Event): void {
    const timestamp = (<CustomEvent<number>>ev).detail;

    this.replayTimeChanged.emit(timestamp);
  }

}
