import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleInterface, VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import {
  BooleanState,
  EntityDetailsComponent,
} from '@concordia-nx-ionic/concordia-shared';
import {
  BehaviorSubject,
  first,
  Observable,
  of,
} from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-vehicles-details',
  templateUrl: './vehicles-details.component.html',
})
export class VehiclesDetailsComponent extends EntityDetailsComponent<VehiclesApiService> implements OnInit {
  loading = true;
  vehicle$!: Observable<VehicleInterface>;

  private readonly INITIAL_EDIT_STATE = {
    global: false,
    details: false,
    position: false,
  };

  editMode = new BehaviorSubject<BooleanState>(this.INITIAL_EDIT_STATE);

  constructor(
    activatedRoute: ActivatedRoute,
    vehicleApiService: VehiclesApiService,
    router: Router,
    private cdref : ChangeDetectorRef,
  ) {
    super(vehicleApiService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.vehicle$ = this.getEntityFromQueryId('/vehicles');

    this.vehicle$
      .pipe(first())
      .subscribe(() => {
        this.loading = false;
      });
  }

  disableEditMode(): void {
    this.editMode.next(this.INITIAL_EDIT_STATE);
  }

  updateVehicle(body: VehicleInterface): void {
    const updatedVehicleModel = body;
    this.vehicle$ = of(updatedVehicleModel);
    this.disableEditMode();
    this.cdref.detectChanges();
  }
}
