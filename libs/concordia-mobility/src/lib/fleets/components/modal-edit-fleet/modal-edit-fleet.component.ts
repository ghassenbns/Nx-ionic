import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  FleetDataInterface,
  FleetsApiService,
  RelatedUsersApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, map, Observable, Subscription, switchMap, tap } from 'rxjs';

import { fleetDataConfig } from '../fleets-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-edit-fleet',
  templateUrl: './modal-edit-fleet.component.html',
  styleUrls: ['./modal-edit-fleet.component.scss'],
})
export class ModalEditFleetComponent implements OnInit, OnDestroy {
  strategy = fleetDataConfig;
  loading = false;
  model: any = {};
  user$!: Observable<UserInterface | null>;

  private subscription = new Subscription();

  constructor(
    public navParams: NavParams,
    private readonly modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly fleetsApiService: FleetsApiService,
    private readonly relatedUsersApiService: RelatedUsersApiService,
    private readonly notificationService: UINotificationStateService,
    private readonly userService: UserStateService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.userService.getUser$();

    if(this.navParams.get('data')){
      this.model = { ...this.navParams.get('data') };
    }

    this.subscription.add(
      this.user$
        .pipe(
          tap((user) => {
            this.strategy.columns.forEach((i) => {
              if(i.field === 'owner') {
                i.disabled = !!(user?.userLevelId !== 1 || this.model._id);
              }
            });

            if(user?.userLevelId !== 1 && !this.model._id) {
              this.model.ownerId = user?.userId;
            }
          }),
        )
        .subscribe());

    this.loading = true;

    this.relatedUsersApiService.listOwners()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
        map((owners: any ) => {
          this.strategy.columns.forEach((i) => {
            if(i.field === 'owner') {
              i.options = owners.data;
            }
          });
        }),
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cancel(data: unknown = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  edit(event: PartialWithRequiredKey<FleetDataInterface, '_id'>): void {
    this.fleetsApiService.edit(
      event,
    )
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(
      (i) => this.cancel(i).then(),
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

  store(event: PartialWithRequiredKey<FleetDataInterface, '_id'>): void {
    this.user$.pipe(
      switchMap((user) => this.fleetsApiService.store(
            {
              ...event,
              ...user?.userLevelId !== 1 && {
                ownerId: user?.userId,
              },
            },
          ),
      ),
    ).pipe(
      first(),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (i) => this.cancel(i).then(),
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
}
