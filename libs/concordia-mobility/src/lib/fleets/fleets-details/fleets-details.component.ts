import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FleetDataInterface,
  FleetsApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  EntityDetailsComponent,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import {
  first,
  Observable,
  Subject,
} from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-fleets-edit',
  templateUrl: './fleets-details.component.html',
  styleUrls: ['./fleets-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetsDetailsComponent extends EntityDetailsComponent<FleetsApiService> implements OnInit {
  private _fleet$: Subject<FleetDataInterface> = new Subject();
  fleet$: Observable<FleetDataInterface> = this._fleet$.asObservable();

  loading = false;

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    private fleetsService: FleetsApiService,
    private readonly notificationService: UINotificationStateService,
    private readonly translocoService: TranslocoService,
  ) {
    super(fleetsService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loading = true;

    this.getEntityFromQueryId('/fleets').subscribe(
      i => {
        this.loading = false;
        this._fleet$.next(i);
      },
    );
  }

  getFleet(id: any): void {
    this.fleetsService.show(id, { params: { details: true } })
      .pipe(
        first(),
      )
      .subscribe((res) => {
          this._fleet$.next(res.data);
        },
        ({ error }) => {
          this.notificationService.error(
            error.data.errors
              .map((i: any) =>
                'errorDetails' in i
                  ? i.errorDetails.join(' ')
                  : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
          );
        });
  }

  updateFleet(i: any): void {
    this._fleet$.next(i);
  }
}
