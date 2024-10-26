import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, RightEnum } from '@concordia-nx-ionic/concordia-core';
import {
  FleetDataInterface,
  FleetsApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
  AlertService,
  paramsFn,
  PartialWithRequiredKey,
  TableContainerComponent,
} from '@concordia-nx-ionic/concordia-shared';
import { HttpRecordType } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, tap } from 'rxjs';

import { ModalEditFleetComponent } from '../modal-edit-fleet/modal-edit-fleet.component';
import { fleetDataConfig } from './config';

@Component({
  selector: 'concordia-nx-ionic-fleets-table',
  templateUrl: './fleets-table.component.html',
  styleUrls: ['./fleets-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetsTableComponent extends TableContainerComponent {
  records!: HttpRecordType<FleetDataInterface>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    alertService: AlertService,
    translocoService: TranslocoService,
    notificationService: UINotificationStateService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private fleetsApiService: FleetsApiService,
    private modalCtrl: ModalController,
  ) {
    super(route, router, alertService, translocoService, notificationService);

    this.strategy = fleetDataConfig;

    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, this.strategy.name);
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, this.strategy.name);
  }

  loadEvent(event: any | null = null): void {
    this.loading = true;

    if (event) {
      this.currentEvent = event;
    }

    this.fleetsApiService.records(paramsFn(this.currentEvent))
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

  changeActive(rows: PartialWithRequiredKey<FleetDataInterface, '_id'>[], event: boolean): void {
    const params = rows.map(row => ({
      _id: row._id,
      isActive: event,
    }));

    this.fleetsApiService.editMany(params)
      .pipe(
        first(),
        tap(() => this.loadEvent()),
      ).subscribe();
  }

  delete(ids: PartialWithRequiredKey<FleetDataInterface, '_id'>[]): void {
    this.fleetsApiService.deleteMany(ids)
      .pipe(
        first(),
        ).subscribe(
      (fleet) => {
        this.translate('success.deletedFleet', {
          count: fleet.data,
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

  edit(row: PartialWithRequiredKey<FleetDataInterface, '_id'>): void {
    this.onEditModal(row).then();
  }

  async onEditModal(row: PartialWithRequiredKey<FleetDataInterface, '_id'> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalEditFleetComponent,
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
