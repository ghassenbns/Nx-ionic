import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UsersApiService,
  UsersRelationshipsApiService,
  UsersRelationshipsInterface,
} from '@concordia-nx-ionic/concordia-api';
import { UserInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { UserLevelEnum, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesApiService, HierarchiesInterface } from '@concordia-nx-ionic/concordia-energy-api';
import {
  Column,
  PartialWithRequiredKey,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { filter, finalize, first, Observable, Subscription, tap } from 'rxjs';

import { hierarchiesDataConfig } from '../hierarchies-table/config';

@Component({
  selector: 'concordia-nx-ionic-modal-edit-hierarchy',
  templateUrl: './modal-edit-hierarchy.component.html',
  styleUrls: ['./modal-edit-hierarchy.component.scss'],
})
export class ModalEditHierarchyComponent implements OnInit, OnDestroy {
  strategy: Strategy = JSON.parse(JSON.stringify(hierarchiesDataConfig));
  loading = false;
  model: any = {};
  user$!: Observable<UserInterface | null>;

  private subscription = new Subscription();

  constructor(
    public navParams: NavParams,
    private readonly modalCtrl: ModalController,
    private readonly translocoService: TranslocoService,
    private readonly usersApiService: UsersApiService,
    private readonly notificationService: UINotificationStateService,
    private readonly userService: UserStateService,
    private readonly hierarchiesApiService: HierarchiesApiService,
    private readonly usersRelationshipsApiService: UsersRelationshipsApiService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.userService.getUser$();

    if(this.navParams.get('data')){
      this.load(this.navParams.get('data')._id);
    }

    this.strategy.columns.forEach(i => {
      if(i.field === 'leaf') {
        i.disabled = !!this.navParams?.get('data')?._id;
      }
    });

    if (!this.model.ownerId) {
      this.userService.getUser$()
        .pipe(
          first(),
          filter(i => !!i),
          tap(i => {
            this.model.ownerId = i?.userId;
            this.getUsersRelationships(this.model.ownerId);
          }),
        )
        .subscribe();

    } else {
      this.getUsersRelationships(this.model.ownerId);
    }

    const params = {
      filter: JSON.stringify([
        {
          scope: 'user_level_id',
          operator: '<=',
          value: UserLevelEnum.LEVEL_ID_OPERATOR,
          type: 'int',
        },
      ]),
    };

    this.usersApiService.list({ params })
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.strategy.columns.forEach(i => {
          if(i.field === 'owner' || i.field === 'viewers') {
            i.options = res.data;
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cancel(data: unknown = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  load(id: string): void {
    this.hierarchiesApiService.show(id)
      .pipe(
      first(),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (i) => {
        this.model = {
          ...i,
          ownerId: i.owner.userId,
          viewerIds: i.viewers?.map((v: any) => v.userId),
        };
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

  edit(event: PartialWithRequiredKey<HierarchiesInterface, '_id'>): void {
    this.hierarchiesApiService.update(
      {
        ...event,
        viewerIds: event?.viewerIds ? event?.viewerIds : [],
      },
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

  store(event: PartialWithRequiredKey<HierarchiesInterface, '_id'>): void {
    this.hierarchiesApiService.store(
      {
        ...event,
        viewerIds: event?.viewerIds ? event?.viewerIds : [],
      },
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

  getUsersRelationships(id: string): void {
    this.usersRelationshipsApiService.list({ params: { user_id: id } })
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.strategy.columns.forEach((column: Column) => {
          if (column.field === 'viewers') {
            column.options = res.data.map((d: UsersRelationshipsInterface) => ({ ...d, name: d.relatedUser.name }));
          }
        });
      });
  }

  changeValue(event: any): void {
    if(event.rowSelector === 'ownerId') {
      this.model = {
        ...this.model,
        viewerIds: [],
      };

      this.getUsersRelationships(event.value);
    }
  }
}
