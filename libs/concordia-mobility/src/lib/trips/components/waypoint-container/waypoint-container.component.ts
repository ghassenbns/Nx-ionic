import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
// this import is commented to let the test pass
// import { MapWrapperComponent } from '@concordia-nx-ionic/concordia-map';
import {
  Feature,
  reOrder,
  TripsApiServices,
  TripsDataInterface,
  Waypoints,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, skip, Subscription } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-waypoint-container',
  templateUrl: './waypoint-container.component.html',
  styleUrls: ['./waypoint-container.component.scss'],
})
export class WaypointContainerComponent implements OnInit, OnDestroy {
  // see import comment
  // @ViewChild('mapComponent') mapComponent!: MapWrapperComponent;
  @ViewChild('mapComponent') mapComponent!: any;

  _waypoints!: Waypoints;
  _d_waypoints!: Waypoints;

  @Input() set waypoints(v: Waypoints) {
    if (v) {
      this._waypoints = JSON.parse(JSON.stringify(v));
      this._d_waypoints = JSON.parse(JSON.stringify(v));
    }
  }

  get waypoints(): Waypoints {
    return this._waypoints;
  }

  @Input() _id!: string;
  @Input() editable = false;
  @Output() submitted = new EventEmitter<TripsDataInterface>();

  editMode = false;
  changes = false;
  loading = false;
  showMap = false;

  private subscription = new Subscription();

  constructor(
    public readonly tripsApiServices: TripsApiServices,
    private readonly notificationService: UINotificationStateService,
    private readonly translocoService: TranslocoService,
    private readonly uiState: UiStateService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.uiState.showMenu()
        .pipe(
          skip(1),
        )
        .subscribe(() => {
          this.mapComponent.resizeMap();
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const newWaypoints = {
      _id: this._id,
      waypoints: this.waypoints,
    };

    this.loading = true;

    this.tripsApiServices.edit(
      newWaypoints,
    )
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(
      ({ data }: any) => {
        this.editMode = false;
        this.changes = false;

        this.submitted.emit(data);
      },
      ({ error }) => {
        this.notificationService.error(
          error.data.errors
            .map((i: any) =>
              'errorDetails' in i
                ? i.errorDetails.join(' ')
                : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
        );
      },
    );
  }

  onCancel(): void {
    this.toggleEditMode(false);
    this.waypoints = { ...JSON.parse(JSON.stringify(this._d_waypoints)) };
    this.changes = false;
  }

  toggleEditMode(b: boolean): void {
    this.editMode = b;

    if (b) {
      this.showMap = true;
    }
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
  }

  onDelete($event: Feature): void {
    this.changes = true;

    this._waypoints = {
      ...this._waypoints,
      features: this._waypoints.features
        .filter((i: Feature) => i.id !== $event.id)
        .map((i: Feature, index: number) => ({
          ...i,
          properties: {
            ...i.properties,
            index: index,
          },
        })),
    };
  }

  onAdd(event: Event): void {
    if (event) {
      this.changes = true;
      this.setSelected();
      this.mapComponent.addNewPoint();
    }
  }

  reOrder(event: reOrder): void {
    this.changes = true;

    const from = this._waypoints.features[event.from];
    from.properties.index = event.to;

    const to = this._waypoints.features[event.to];
    to.properties.index = event.from;

    this._waypoints.features[event.from] = to;
    this._waypoints.features[event.to] = from;
  }

  onActive(id: string): void {
    this.setSelected(id);
    this.mapComponent.setFeatureSelectedState(id);
  }

  onDataUpdate(event: any): void {
    this.changes = true;

    if (event.id) {

      if (this._waypoints.features.find(i => i.id === event.id)) {

        this._waypoints = {
          ...this._waypoints,
          features: this._waypoints.features
            .map((feature: any) => ({
              ...(feature.id === event.id
                ? event
                : feature),
            })),
        };
      } else {
        this._waypoints.features.push(event);
      }
    }
  }

  onSelectedPoint(event: any): void {
    if (event?.id || !event) {
      this.setSelected(event?.id);
    }
  }

  setSelected(id = ''): void {
    this._waypoints.features
      .forEach((i: Feature) => {
        const isMatch = i.id === id;
        i.state = {
          hovered: isMatch,
          selected: isMatch,
        };
      });
  }
}
