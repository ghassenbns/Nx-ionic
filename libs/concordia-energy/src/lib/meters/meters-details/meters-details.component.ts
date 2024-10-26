import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService, RightEnum, RouterStateService } from '@concordia-nx-ionic/concordia-core';
import { MeterInterface, MeterTypes } from '@concordia-nx-ionic/concordia-energy-api';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { CardConfigInterface, PartialWithRequiredKey } from '@concordia-nx-ionic/concordia-shared';
import { ModalController } from '@ionic/angular';
import {
  distinctUntilChanged,
  filter,
  first,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { ModalEditMeterComponent } from '../components/modal-edit-meter/modal-edit-meter.component';

@Component({
  selector: 'concordia-nx-ionic-meters-details',
  templateUrl: './meters-details.component.html',
  styleUrls: ['./meters-details.component.scss'],
})
export class MetersDetailsComponent implements OnInit, OnDestroy {
  METER_TYPES = MeterTypes;

  id$!: Observable<string>;
  meter$!: Observable<MeterInterface>;
  loadingMeter$: Observable<boolean> = of(true);
  canEdit$: Observable<boolean>;
  canDelete$: Observable<boolean>;

  mapCardConfig: CardConfigInterface = {
    title: 'position',
    editable: { state: false },
    selector: 'position',
  };
  showMap = false;
  segment = 'details';

  private destroy$ = new Subject<void>();

  constructor(
    private readonly routerStateService: RouterStateService,
    private readonly meterStateService: MetersStateService,
    private readonly appStateService: AppStateService,
    private readonly modalCtrl: ModalController,
  ) {
    this.canEdit$ = this.appStateService.hasRight$(RightEnum.WRITE, 'energy_meters');
    this.canDelete$ = this.appStateService.hasRight$(RightEnum.DELETE, 'energy_meters');
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

    this.loadingMeter$ = this.meterStateService.getPendingStatus$();

    //get the id route param
    this.id$ = this.routerStateService.getParam$('id')?.pipe(
      takeUntil(this.destroy$),
      filter(id => !!id),
      distinctUntilChanged(),
      first(),
      tap(id => {
        this.meterStateService.loadMeter(id);
      }),
      shareReplay(),
    );

    //use the id to retrieve the associated meter
    this.meter$ = this.id$?.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      first(),
      switchMap((id) => this.meterStateService.getMeter(id)),
      shareReplay(),
    );
  }

  segmentChanged(ev: any): void {
    this.segment = ev.detail.value;
  }

  async onEditModal(row: PartialWithRequiredKey<MeterInterface, '_id'> | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalEditMeterComponent,
      cssClass: 'w-4',
      ...row && {
        componentProps: { data: row },
      },
    });
    modal.present().then();

    const { data } = await modal.onWillDismiss();

    if (data?.status === 'ok') {
      this.meterStateService.setMeter(data.data);
    }
  }

}
