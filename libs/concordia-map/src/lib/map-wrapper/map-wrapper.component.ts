import {
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Inject,
  Input, OnDestroy,
  OnInit,
  Output, ViewChild,
} from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { Feature } from '@concordia-nx-ionic/concordia-mobility-api';
import { MAP_ELEMENT } from '@concordia-nx-ionic/concordia-shared';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-map',
  templateUrl: './map-wrapper.component.html',
  styleUrls: ['./map-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapWrapperComponent implements AfterContentInit, OnInit, OnDestroy {
  theme$!: Observable<string>;

  @ViewChild('concordiaMap') concordiaMap!: ElementRef;

  @Input() editMode = false;
  @Input() enableGeocoding = false;
  @Input() enablePopup = false;
  @Input() enableSelection = true;
  @Input() enableMarkerControl = false;
  @Input() allowMultiPointCreation = false;
  @Input() mapOptions: any = {};
  @Input() maxFitZoom = 15;

  @Input() data: any = {
    type: 'FeatureCollection',
    features: [],
  };
  private themeSubscription$!: Subscription;

  @Input() set showMap(show: boolean) {
    if (!this.loading && !show) {
      this.resizeMap();
    }
  }

  @Input() enableFullScreen = true;
  @Output() dataUpdate = new EventEmitter<Feature>();
  @Output() selectedPoint = new EventEmitter<Feature>();
  @Output() mouseEnterMarker = new EventEmitter<any>();
  @Output() mouseLeaveMarker = new EventEmitter<any>();
  @Output() loaded = new EventEmitter<boolean>();

  orsToken = '';
  _mapOptions: any = {};
  loading = true;
  renderIt = true;
  symbolLayerPaint: any = {};

  constructor(
    @Inject(MAP_ELEMENT) private defineCustomElement: () => void,
    private config: ConfigService,
    private readonly translocoService: TranslocoService,
    private readonly userService: UserStateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.orsToken = this.config.getOrsToken();
    this._mapOptions = {
      style: this.config.getMapStyle(),
      cooperativeGestures: {
        windowsHelpText: this.translocoService.translate(`map.cooperativeGestures.windowsHelpText`),
        macHelpText: this.translocoService.translate(`map.cooperativeGestures.macHelpText`),
        mobileHelpText: this.translocoService.translate(`map.cooperativeGestures.mobileHelpText`),
      },
      ...this.mapOptions,
    };
  }

  ngOnDestroy(): void {
    this.themeSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.initializeCustomElement();
    this.theme$ = this.userService.getUserTheme$();
    this.themeSubscription$ = this.theme$
      .subscribe((theme) => {
        //I'm sure it exists a better way than this:
        // https://developapa.com/angular-rerender/#the-ngif-have-you-tried-turning-it-off-and-on-again
        this.renderIt = false;
        this._mapOptions = { ...this._mapOptions };
        this.cdr.detectChanges();
        const textColor = theme === 'dark' ? '#fefefe' : '#000';
        this.symbolLayerPaint = { 'text-color': textColor };
        this._mapOptions = {
          ...this._mapOptions,
          ...this.mapOptions,
          style: this.config.getMapStyle(theme),
        };
        this.renderIt = true;
        this.cdr.detectChanges();

      });

  }

  ngAfterContentInit(): void {
    this.loading = false;
  }

  private initializeCustomElement(): void {
    this.defineCustomElement();
  }

  resizeMap(): void {
    setTimeout(() => {
      this.concordiaMap?.nativeElement.resize().then();
    }, 800);
  }

  //actually used in waypoints map
  setFeatureSelectedState(id: string, selected = true): void {
    this.concordiaMap?.nativeElement.setFeatureSelectedState(id, selected);
  }

  //actually used in waypoints map
  addNewPoint(): void {
    this.concordiaMap?.nativeElement.addNewPoint();
  }

  onSelectedPoint($event: any): void {
    this.selectedPoint.emit($event.detail);
  }

  onDataUpdate($event: any): void {
    this.dataUpdate.emit($event.detail);
  }

  onMouseEnterMarker($event: any): void {
    this.mouseEnterMarker.emit($event.detail);
  }

  onMouseLeaveMarker($event: any): void {
    this.mouseLeaveMarker.emit($event.detail);
  }

  onLoaded($event: any): void {
    this.loaded.emit($event.detail);
  }
}
