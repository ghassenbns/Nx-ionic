import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DecimalSeparator, ThousandSeparator } from '@concordia-nx-ionic/concordia-auth-api';
import { RouterStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  MeterConsumptionComparisonInterface,
  MetersConsumptionComparisonApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import { UserDatePipe } from '@concordia-nx-ionic/concordia-shared';
import { combineLatest, filter, finalize, first, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-consumption-comparison',
  templateUrl: './consumption-comparison.component.html',
  styleUrls: ['./consumption-comparison.component.scss'],
})
export class ConsumptionComparisonComponent implements OnInit {
  tz$!: Observable<string | null>;
  getDateTimeFormat$!: Observable<string | null>;
  decimalSeparator$!: Observable<DecimalSeparator>;
  thousandSeparator$!: Observable<ThousandSeparator>;
  theme$!: Observable<string>;
  records!: MeterConsumptionComparisonInterface | any;
  filters$!: any;
  loading = false;

  private currentFilters = {};
  private currentMeterId = null;

  constructor(
    private readonly userState: UserStateService,
    private readonly metersConsumptionComparisonApiService: MetersConsumptionComparisonApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly routerStateService: RouterStateService,
    private readonly userDatePipe: UserDatePipe,
  ) {
  }

  ngOnInit(): void {
    this.tz$ = this.userState.getTZ$();
    this.getDateTimeFormat$ = this.userState.getDateTimeFormat$();
    this.decimalSeparator$ = this.userState.getDecimalSeparator$();
    this.thousandSeparator$ = this.userState.getThousandSeparator$();
    this.theme$ = this.userState.getUserTheme$();

    this.filters$ =
      this.routerStateService.getQueryParam$('filter')
      .pipe(
        map((filters: string) => {
          const currentFilter = filters ? JSON.parse(filters) : null;

          if (currentFilter && currentFilter?.meterId) {
            const f = {
              ...filters && { ...JSON.parse(filters) },
            };

            if(filters){
              this.loadEvent(f);
            }
            return f;
          } else {
            this.records = {};
            return currentFilter;
          }
        }));
  }

  loadEvent(event: any | null = null): void {
    const dateRange = event.dateRange;

    combineLatest([
      this.userDatePipe.transform(dateRange[0]),
      this.userDatePipe.transform(dateRange[1]),
    ]).pipe(
      map(([from, to]) => ({
        aggregationPeriod: event.aggregationPeriod,
        comparisonTarget: event.comparisonTarget,
        comparisonLookback: event.comparisonLookback,
        viewAsUserId: event.viewAsUserId,
        from: from,
        to: to,
        fillGaps: true,
      })),
      filter((i: any) =>
        !(JSON.stringify(this.currentFilters) === JSON.stringify(i) && event.meterId === this.currentMeterId) ),
      tap(() => this.loading = true),
      switchMap(params => this.metersConsumptionComparisonApiService
        .records(event.meterId, { params })
        .pipe(
          first(),
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
            this.currentFilters = params;
            this.currentMeterId = event.meterId;
          }),
        ),
      )).subscribe((params) => {
      this.records = params.data;
      this.cdr.detectChanges();
    });
  }
}
