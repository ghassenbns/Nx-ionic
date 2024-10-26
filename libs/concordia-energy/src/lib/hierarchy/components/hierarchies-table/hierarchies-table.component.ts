import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '@concordia-nx-ionic/concordia-api';
import { AppStateService, RightEnum, UserLevelEnum } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesApiService, HierarchiesInterface } from '@concordia-nx-ionic/concordia-energy-api';
import {
  AlertService,
  HttpRecordType,
  paramsFn,
  PartialWithRequiredKey,
  TableContainerComponent,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, tap } from 'rxjs';

import { ModalEditHierarchyComponent } from '../modal-edit-hierarchy/modal-edit-hierarchy.component';
import { hierarchiesDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-hierarchies-table',
  templateUrl: './hierarchies-table.component.html',
  styleUrls: ['./hierarchies-table.component.scss'],
})
export class HierarchiesTableComponent extends TableContainerComponent {
  records!: HttpRecordType<any>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private readonly appStateService: AppStateService,
    private readonly cdr: ChangeDetectorRef,
    private readonly hierarchiesApiService: HierarchiesApiService,
    private readonly modalCtrl: ModalController,
    private readonly usersApiService: UsersApiService,
  ) {
    super(route, router, alertService, translocoService, notificationService);

    this.strategy = hierarchiesDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, 'energy_meters');
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, 'energy_meters');

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
          if (i.field === 'owner') {
            i.options = res.data;
          }
        });
      });
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if (event) {
      this.currentEvent = event;
    }

    this.hierarchiesApiService.records(paramsFn(this.currentEvent))
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
          this.start = true;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((res) => {
        this.records = res;
      });
  }

  info(): void {
    // eslint-disable-next-line no-console
    console.log('info');
  }

  override duplicate(row: PartialWithRequiredKey<HierarchiesInterface, '_id'>): void {
    this.hierarchiesApiService.clone(row._id)
      .pipe(
        first(),
      ).subscribe(
      () => {
        this.translate('success.clonedHierarchies')
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
      },
    );
  }

  changeActive(rows: PartialWithRequiredKey<HierarchiesInterface, '_id'>[], event: boolean): void {
    const ids = rows.map(row => `${row._id}`);

    const method  = event ? 'setPublicMany' : 'setPrivateMany';

    this.hierarchiesApiService[method](ids)
      .pipe(
        first(),
        tap(() => this.loadEvent()),
      ).subscribe(
      (hierarchy) => {
        this.translate('success.updatedHierarchies', {
          count: hierarchy.data.length,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });
      });
  }

  delete(rows: PartialWithRequiredKey<HierarchiesInterface, '_id'>[]): void {
    const ids = rows.map(row => row._id);

    this.hierarchiesApiService.deleteMany(ids)
      .pipe(
        first(),
      ).subscribe(
      (hierarchy) => {
        this.translate('success.deletedHierarchies', {
          count: hierarchy.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
      },
    );
  }

  add(): void {
    this.onEditModal().then();
  }

  edit(row: PartialWithRequiredKey<HierarchiesInterface, '_id'>): void {
    this.onEditModal(row).then();
  }

  async onEditModal(row: PartialWithRequiredKey<HierarchiesInterface, '_id'> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalEditHierarchyComponent,
      ...row && {
        componentProps: { data: row },
      },
    });
    modal.present().then();

    const { data } = await modal.onWillDismiss();

    if (data?.status === 'ok') {
      this.loadEvent();
    }
  }
}
