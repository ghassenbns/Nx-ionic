import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersApiService } from '@concordia-nx-ionic/concordia-api';
import { UserInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { RouterStateService, UserLevelEnum, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import * as dayjs from 'dayjs';
import { filter, first, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-consumption-comparison-filter',
  templateUrl: './consumption-comparison-filter.component.html',
  styleUrls: ['./consumption-comparison-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsumptionComparisonFilterComponent implements OnInit {
  @ViewChild(NgForm) form!: NgForm;
  @ViewChild('viewAsUserId') viewAsUserId!: NgForm;

  yesterday: number[] = [];
  maxDateFull = 0;

  defItem: any = {
    meterId: '',
    viewAsUserId: null,
    dateRange: null,
    aggregationPeriod: 'hour',
    comparisonTarget: 'custom_period',
    comparisonLookback: 0,
  };

  item = { ...this.defItem };

  @Input() set filters(f: any) {
    if(!f){
      this.item = {
        ...this.defItem,
      };

      this.form?.control?.markAsPristine({ onlySelf: false });
    }

    if (!this.form?.value) {
      this.item = {
        ...this.defItem,
        ...f,
      };

      this.form?.control?.markAsPristine({ onlySelf: false });
    } else {
      this.item = {
        ...this.item,
        hierarchyId: f.hierarchyId,
        nodeId: f.nodeId,
        meterIds: f.meterIds,
      };
    }

    this.currMeterId = this.form ? this.form.controls['meterId'].value : f?.meterId;

    const viewAsUserId = this.form ? this.form.controls['viewAsUserId'].value : f?.viewAsUserId;

    if(viewAsUserId || this.item.viewAsUserId || f?.meterIds) {
      this.loadMeter(viewAsUserId ?? this.item.viewAsUserId, f?.meterIds);
    }
  }

  @Input() set tz(t: string | null) {
    if(t) {
      this.yesterday = [
        dayjs().subtract(1, 'days').utcOffset(t).startOf('date').valueOf(),
        dayjs().subtract(1, 'days').utcOffset(t).endOf('date').valueOf(),
      ];

      this.maxDateFull  = dayjs().utcOffset(t).endOf('date').valueOf();

      this.defItem.dateRange = this.yesterday;

      if (!this.item.dateRange) {
        this.item.dateRange = this.yesterday;
      }
    }
  }

  @Input() loading = false;

  isLessAdmin$!: Observable<boolean>;
  user$!: Observable<UserInterface | null>;
  availableUsers$!: Observable<any[]>;
  metersList$!: Observable<any[]>;

  showFilters = true;

  comparisonTargets = ['day', 'week', 'month', 'year', 'custom_period'];

  aggregationPeriods = ['quarter_hour', 'hour', 'day'];

  private currMeterId: string | null = null;

  constructor(
    private readonly userStateService: UserStateService,
    private readonly usersApiService: UsersApiService,
    private readonly routerStateService: RouterStateService,
    private readonly translocoService: TranslocoService,
    private readonly notificationService: UINotificationStateService,
    private readonly meterStateService: MetersStateService,
  ) {}

  ngOnInit(): void {
    this.metersList$ = this.meterStateService.getMeterList();

    this.isLessAdmin$ = this.userStateService.isAdminMore$()
      .pipe(
        first(),
        map(i=> !i),
      );

    this.user$ = this.userStateService.getUser$()
      .pipe(
        filter(u => !!u),
        tap(u => {
          if ( u?.userId) {
            this.defItem.viewAsUserId = u.userId;

            if (!this.item.viewAsUserId) {
              this.item.viewAsUserId = u.userId;
              this.loadMeter(u.userId);
            }
          }
        }),
        first(),
      );

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

    this.availableUsers$ = this.isLessAdmin$.pipe(
      filter(i => !i),
      switchMap(() => this.usersApiService.list({ params })
        .pipe(
          map(i => i.data),
        )),
    );
  }

  disabledReset(): boolean {
    if(this.form?.value) {
      return Object.keys(this.form.value)
        .every((key: any) => key in this.defItem && this.form.value[key] === this.defItem[key]);
    }

    return false;
  }

  onResetFilter(): void {
    this.form.setValue(this.defItem);

    this.item = {
      ...this.item,
      ...this.defItem,
    };

    this.routerStateService.navigate([], undefined, {
      queryParamsHandling: 'merge',
      queryParams: {
        filter: JSON.stringify({
          ...this.item,
          ...this.form.value,
        }),
      },
    });

    this.loadMeter(this.defItem.viewAsUserId, this.item.meterIds);
  }

  onEnterApplyFilter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onApplyFilter();
    }
  }

  onApplyFilter(): void {
    if(this.form.valid) {
      this.routerStateService.navigate([], undefined, {
        queryParamsHandling: 'merge',
        queryParams: {
          filter: JSON.stringify({
            ...this.item,
            ...this.form.value,
          }),
        },
      });

      this.form.control.markAsPristine({ onlySelf: false });
    } else {
      this.form.control.markAllAsTouched();
      this.translocoService
        .selectTranslate(`errors.invalidForm`)
        .pipe(first())
        .subscribe(errorMessage => {
          this.notificationService.error(errorMessage);
        });
    }
  }

  onShowFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSetDate(dates: any): void {
    if(dates?.length) {
      const monthPlusSec = (dayjs(dates[1]).add(1, 'second')).diff(dates[0], 'month');
      const month = dayjs(dates[1]).diff(dates[0], 'month');

      this.item.aggregationPeriod = null;
      this.item.aggregationPeriod = monthPlusSec
        ? (month < 2 ? 'day' : null)
        : 'hour';

      this.form.control.markAllAsTouched();
      this.form.controls['aggregationPeriod'].setValue(this.item.aggregationPeriod);
      this.item.comparisonTarget = 'custom_period';
    }
  }

  disabledAggregationPeriodsOption(option: string, dates: any[]): boolean {
    const month = dayjs(dates[1]).diff(dates[0], 'month');
    const day = dayjs(dates[1]).diff(dates[0], 'day');

    return !(option === 'day' && (day && month < 2))
      && !(option === 'quarter_hour' && month < 1)
      && !(option === 'hour' && month < 2);
  }

  disabledComparisonOption(option: string, dates: any[]): boolean {
    const day = (dayjs(dates[1]).add(0, 'second')).diff(dates[0], 'day');
    const week = (dayjs(dates[1]).add(0, 'second')).diff(dates[0], 'week');
    const month = (dayjs(dates[1]).add(0, 'second')).diff(dates[0], 'month');

    return !!dates && option !== 'year' && option !== 'custom_period'
      && !(option === 'day' && !day)
      && !(option === 'week' && !week)
      && !(option === 'month' && !month);
  }

  getName(option: string): string {
    return option.charAt(0);
  }

  setAggregationPeriod(value: string): void {
    this.item.aggregationPeriod = value;
    this.form.control.markAsDirty();
  }

  loadMeter(userId: number | string, meterIds: string[] = [], clean = false): void {
    this.meterStateService.loadMeterList({ viewAsUserId: userId, meterIds: meterIds });

    if(clean) {
      this.item.meterId = null;
    }
  }

  getMeters(metersList: any, viewAsUserId: string, metersIds: string[]): any[] {
    if(this.form?.controls['meterId']){
      this.form.controls['meterId'].setValue(null);
    }

    if(!viewAsUserId) {
      return [];
    }

    const list = (metersIds && metersIds.length
        ? metersList[`${viewAsUserId}__${metersIds.join('_')}`]
        : metersList[viewAsUserId]);

    if(list?.find((i: any) => i._id === this.currMeterId)){
      this.form.controls['meterId'].setValue(this.currMeterId);
    }

    return list ?? [];
  }

  setMeterId(value: string | null): void {
    this.currMeterId = value;
  }
}
