import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DriverDataInterface,
  DriversApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  BooleanState,
  EntityDetailsComponent,
} from '@concordia-nx-ionic/concordia-shared';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-drivers-details',
  templateUrl: './drivers-details.component.html',
  styleUrls: ['./drivers-details.component.scss'],
})
export class DriversDetailsComponent extends EntityDetailsComponent<DriversApiService> implements OnInit {
  driver$!: Observable<DriverDataInterface>;

  private readonly INITIAL_EDIT_STATE = {
    global: false,
    details: false,
    position: false,
  };

  editMode = new BehaviorSubject<BooleanState>(this.INITIAL_EDIT_STATE);

  constructor(
    activatedRoute: ActivatedRoute,
    driversService: DriversApiService,
    router: Router,
    private cdref: ChangeDetectorRef,
  ) {
    super(driversService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.driver$ = this.getEntityFromQueryId('/drivers');
  }

  disableEditMode(): void {
    this.editMode.next(this.INITIAL_EDIT_STATE);
  }

  updateDriver(body: DriverDataInterface): void {
          const updatedDriverModel = body;
          this.driver$ = of(updatedDriverModel);
          this.disableEditMode();
          this.cdref.detectChanges();
  }
}
