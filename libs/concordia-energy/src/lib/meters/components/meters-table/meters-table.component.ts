import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '@concordia-nx-ionic/concordia-api';
import { TimezonesStateService } from '@concordia-nx-ionic/concordia-api-store';
import { AppStateService, RightEnum, UserLevelEnum, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MeterInterface, MetersApiService } from '@concordia-nx-ionic/concordia-energy-api';
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
import { BehaviorSubject, finalize, first, Observable, Subject, takeUntil } from 'rxjs';

import { ModalEditMeterComponent } from '../modal-edit-meter/modal-edit-meter.component';
import { metersDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-meters-table',
  templateUrl: './meters-table.component.html',
  styleUrls: ['./meters-table.component.scss'],
})
export class MetersTableComponent extends TableContainerComponent {
  records!: HttpRecordType<MeterInterface>;

  private _loadingEntity: Subject<boolean> = new BehaviorSubject(false);
  loadingEntity$: Observable<boolean> = this._loadingEntity.asObservable();

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private readonly appStateService: AppStateService,
    private readonly userStateService: UserStateService,
    private readonly cdr: ChangeDetectorRef,
    private readonly metersApiService: MetersApiService,
    private readonly usersApiService: UsersApiService,
    private readonly timezonesStateService: TimezonesStateService,
    private readonly modalCtrl: ModalController,
  ) {
    super(route, router, alertService, translocoService, notificationService);

    this.strategy = metersDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);

    this.userStateService.isSuperAdmin$()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(i => {
        this.strategy.columns.forEach(c => {
          if (c.field === 'viewAsUser') {
            c.addFilter = !!i;
          }
        });
      });

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
          if (i.field === 'owner' || i.field === 'viewAsUser') {
            i.options = res.data;
          }
        });
      });

    this.timezonesStateService.loadTimezones();

    this.timezonesStateService.getTimezones()
      .subscribe(data => {
        if(data.length) {
          this.strategy.columns.forEach(i => {
            if (i.field === 'timezone') {
              i.options = data;
              // this.cdr.detectChanges();
            }
          });
        }
      });
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if (event) {
      this.currentEvent = event;
    }

    this.metersApiService.records(paramsFn(this.currentEvent))
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

  changeActive(rows: PartialWithRequiredKey<MeterInterface, '_id'>[], event: boolean): void {
    const params = {
      _id: rows.map(row => row._id),
      isPublic: event,
    };

    this.metersApiService.setPublicMany(params)
      .pipe(
        first(),
      ).subscribe(
      (meter) => {
        this.translate('success.updatedMeter', {
          count: meter.data,
        })
          .subscribe(message => {
            this.notificationService.success(message);
          });

        this.loadEvent();
      });
  }

  delete(ids: PartialWithRequiredKey<MeterInterface, '_id'>[]): void {
    this.metersApiService.deleteMany(ids)
      .pipe(
        first(),
      ).subscribe(
      (meter) => {
        this.translate('success.deletedMeter', {
          count: meter.data,
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

  edit(row: PartialWithRequiredKey<MeterInterface, '_id'>): void {
    if(row._id) {
      this._loadingEntity.next(true);

      this.metersApiService.show(row._id)
        .pipe(
          first(),
        )
        .subscribe((i: any) => {
          this._loadingEntity.next(false);
          this.onEditModal(i.data).then();
        });
    }
  }

  async onEditModal(row: PartialWithRequiredKey<MeterInterface, '_id'> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalEditMeterComponent,
      cssClass: `w-${this.strategy.column}`,
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
