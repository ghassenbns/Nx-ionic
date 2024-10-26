import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterStateService } from '@concordia-nx-ionic/concordia-core';
import { TariffInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import {
  distinctUntilChanged,
  filter,
  first,
  Observable,
  of,
  Subject, switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-meter-latest-tariff-card',
  templateUrl: './latest-tariff-card.component.html',
  styleUrls: ['./latest-tariff-card.component.scss'],
})
export class MeterLatestTariffCardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  id$: Observable<string> = of('');
  latestTariff$!: Observable<TariffInterface | any>;
  loadingMeterLatestTariff$: Observable<boolean> = of(true);

  constructor(
    private readonly routerStateService: RouterStateService,
    private readonly meterStateService: MetersStateService,
  ) {
  }

  ngOnInit(): void {
    this.loadingMeterLatestTariff$ = this.meterStateService.getLatestTariffPendingStatus$();
    //get the id route param
    this.id$ = this.routerStateService.getParam$('id')?.pipe(
      takeUntil(this.destroy$),
      filter(id => !!id),
      distinctUntilChanged(),
      first(),
      tap(id => {
        this.meterStateService.loadMeterLatestTariff(id);
      }),
    );
    //load latest tariffs
    this.latestTariff$ = this.id$?.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      first(),
      switchMap((id) => {
        return this.meterStateService.getMeterLatestTariff(id);
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

}
