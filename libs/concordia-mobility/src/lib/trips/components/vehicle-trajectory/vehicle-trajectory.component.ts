import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripsDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';
import { TranslocoService } from '@ngneat/transloco';
import { combineLatest, first, tap } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-vehicle-trajectory',
  templateUrl: './vehicle-trajectory.component.html',
  styleUrls: ['./vehicle-trajectory.component.scss'],
})
export class VehicleTrajectoryComponent implements OnInit {
  @Input() loading = false;
  @Input() trip!: TripsDataInterface | undefined | null;
  @Input() time!: number | null;
  @Output() replayTimeChanged = new EventEmitter<number>();
  @Output() replayZoomTime = new EventEmitter<number>();
  mapLabels: any = {
        vehicleDetails: 'Vehicle details',
        vehicleName: 'Vehicle name',
        tripDetails: 'Trip details',
        dashboardDetail: 'Dashboard detail',
        showHistoricalDataLabel: 'Display historical data',
        hideHistoricalDataLabel: 'Display realtime data',
        hideEventLayerLabel: 'Hide events',
        showEventLayerLabel: 'Show events',
        showWaypointLabel: 'Show waypoints',
        hideWaypointLabel: 'Hide waypoints',
        fullScreenLabel: 'Fullscreen',
        showVehicleFilters: 'Show filters',
        hideVehicleFilters: 'Hide filters',
        estimatedPosition: 'Estimated position',
    };

    constructor(private readonly translocoService : TranslocoService){
    }

    ngOnInit(): void {
      combineLatest([
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.vehicleDetails'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.vehicleName'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.tripDetails'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.dashboardDetail'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.showHistoricalDataLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.hideHistoricalDataLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.hideEventLayerLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.showEventLayerLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.showWaypointLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.hideWaypointLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.fullScreenLabel'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.showVehicleFilters'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.hideVehicleFilters'),
        this.translocoService.selectTranslate('vehicleTrajectory.mapLabels.estimatedPosition'),
      ]).pipe(
        first(),
        tap(([vehicleDetails, vehicleName, tripDetails, dashboardDetail,
               showHistoricalDataLabel, hideHistoricalDataLabel, hideEventLayerLabel, showEventLayerLabel,
               showWaypointLabel, hideWaypointLabel, fullScreenLabel, showVehicleFilters,
               hideVehicleFilters, estimatedPosition,
             ]) => {

          const mapLabelTranslations: any = {
            vehicleDetails: vehicleDetails,
            vehicleName: vehicleName,
            tripDetails: tripDetails,
            dashboardDetail: dashboardDetail,
            showHistoricalDataLabel: showHistoricalDataLabel,
            hideHistoricalDataLabel: hideHistoricalDataLabel,
            hideEventLayerLabel: hideEventLayerLabel,
            showEventLayerLabel: showEventLayerLabel,
            showWaypointLabel: showWaypointLabel,
            hideWaypointLabel: hideWaypointLabel,
            fullScreenLabel: fullScreenLabel,
            showVehicleFilters: showVehicleFilters,
            hideVehicleFilters: hideVehicleFilters,
            estimatedPosition: estimatedPosition,
          };

          // console.error('mapLabelTranslations', mapLabelTranslations);
          this.mapLabels = { ...this.mapLabels, ...mapLabelTranslations };
        }),
      ).subscribe();
    }
  get isValidTrip(): boolean {
    return !!this.trip?.waypoints?.features?.length;
  }

  onReplayTimeChanged(event: number): void {
    if(typeof event === 'number') {
      this.replayZoomTime.emit(0);
      this.replayTimeChanged.emit(event);
    }
  }

  onTripEventClicked(event: any): void {
    const time = event?.detail?.properties?.timestamp || event?.properties?.timestamp;

    if(time) {
      this.replayTimeChanged.emit(time);
      this.replayZoomTime.emit(time);
    }
  }

  onDriverEventClicked(event: any): void {
    const time = event?.detail?.properties?.timestamp || event?.properties?.timestamp;

    if(time) {
      this.replayTimeChanged.emit(time);
      this.replayZoomTime.emit(time);
    }
  }

  onVehicleEventClicked(event: any): void {
    const time = event?.detail?.properties?.timestamp || event?.properties?.timestamp;

    if(time) {
      this.replayTimeChanged.emit(time);
      this.replayZoomTime.emit(time);
    }
  }

  onWaypointClicked(event: any): void {
    const time = event?.detail?.properties?.timestamp || event?.properties?.timestamp;

    if(time) {
      this.replayTimeChanged.emit(time);
      this.replayZoomTime.emit(time);
    }
  }
}
