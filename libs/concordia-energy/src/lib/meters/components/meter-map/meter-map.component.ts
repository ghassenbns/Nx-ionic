import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { METER_COUNTRIES, METER_COUNTRIES_BOUNDS, MeterInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { MapWrapperComponent } from '@concordia-nx-ionic/concordia-map';
import { FeatureCollection } from 'geojson';
import { combineLatest, skip, Subscription } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-meter-map',
  templateUrl: './meter-map.component.html',
  styleUrls: ['./meter-map.component.scss'],
})
export class MeterMapComponent implements OnInit, OnDestroy {
  @Input() isLoading: boolean | null = false;

  @Input() set meter(value: MeterInterface) {
    this._meter = { ...value };
    this.handleMeterUpdate();
  }

  get meter(): MeterInterface {
    return this._meter;
  }

  private _meter!: any;
  @ViewChild('mapComponent') mapComponent!: MapWrapperComponent | undefined;
  meterLocation: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  showMap = false;
  private subscription = new Subscription();
  mapOptions: any = { zoom: 12 };

  constructor(private uiStateService: UiStateService) {

  }

  ngOnInit(): void {
    this.handleMeterUpdate();

    this.subscription.add(
      combineLatest([
        this.uiStateService.showRightPanel(),
        this.uiStateService.showMenu(),
      ])
        .pipe(
          skip(1),
        )
        .subscribe(() => {
          this.resizeMap();
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleMeterUpdate(): void {
    if (this.meter?.localization) {
      this.mapOptions = {
        zoom: 12,
        center:
          {
            lon: this.meter.localization.longitude,
            lat: this.meter.localization.latitude,
          },
      };
      this.meterLocation = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          id: this.meter._id,
          geometry: {
            type: 'Point',
            coordinates: [this.meter.localization.longitude, this.meter.localization.latitude],
          },
          properties: {
            id: this.meter._id,
            'address': this.meter.localization.address,
          },

        }],
      };
      this.setMapBounds();
      this.showMap = true;
    }
  }

  private setMapBounds(): void {
    switch (this.meter.country) {
      case METER_COUNTRIES.PERU:
        this.mapOptions.maxBounds = METER_COUNTRIES_BOUNDS.PERU;
        break;
      case METER_COUNTRIES.SPAIN:
        this.mapOptions.maxBounds = METER_COUNTRIES_BOUNDS.SPAIN;
        break;
      case METER_COUNTRIES.LITHUANIA:
        this.mapOptions.maxBounds = METER_COUNTRIES_BOUNDS.LITHUANIA;
        break;
      default:
        this.mapOptions.maxBounds = [[0, 0], [0, 0]];
        break;
    }
  }

  resizeMap(): void {
    if (this.mapComponent) {
      setTimeout(() => {
        this.mapComponent?.resizeMap();
      }, 0);
    }
  }

  // loadedHandler($evt: any): void {
  //   this.mapComponent?.resizeMap();
  // }
}
