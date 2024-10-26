import {
  Component, ElementRef, Input, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { ColorsService } from '@concordia-nx-ionic/concordia-api-store';
import { DecimalSeparator, ThousandSeparator } from '@concordia-nx-ionic/concordia-auth-api';
import { MeterConsumptionComparisonInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { CHART_OPTIONS, UserDateFormatPipe, UserNumberPipe } from '@concordia-nx-ionic/concordia-shared';
import { TranslocoService } from '@ngneat/transloco';
import { Chart } from 'chart.js';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-consumption-comparison-chart',
  templateUrl: './consumption-comparison-chart.component.html',
  styleUrls: ['./consumption-comparison-chart.component.scss'],
})
export class ConsumptionComparisonChartComponent implements OnInit, OnDestroy {
  @ViewChild('lineCanvas') public lineCanvas!: ElementRef;
  @Input() loading = false;
  @Input() decimalSeparator!: DecimalSeparator;
  @Input() thousandSeparator!: ThousandSeparator;
  @Input() getDateTimeFormat!: string;

  _records!: MeterConsumptionComparisonInterface;
  @Input() set records(d: MeterConsumptionComparisonInterface) {
    this._records = d;
    this.setChartData(d);
  }

  get records(): MeterConsumptionComparisonInterface {
    return this._records;
  }

  _theme = 'light';
  @Input() set theme(t: string) {
    this._theme = t;

    if (this.records) {
      this.setChartData(this.records);
    }
  }

  get theme(): string {
    return this._theme;
  }

  chart: any;

  chartData: any = {
    labels: [],
    datasets: [],
  };

  options: any;
  chartType = 'line';

  private destroy$ = new Subject<void>();
  private update = false;
  private title = {
    electricity: '',
    heat: '',
  };

  constructor(
    private readonly colorsService: ColorsService,
    private readonly userNumberPipe: UserNumberPipe,
    private readonly userDateFormatPipe: UserDateFormatPipe,
    private readonly translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.translocoService.selectTranslate('chartType.titleElectricity')
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(value => {
        this.title.electricity = value;
      });

    this.translocoService.selectTranslate('chartType.titleHeat')
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(value => {
        this.title.heat = value;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  setChartData(rez: MeterConsumptionComparisonInterface): void {
    const d = rez?.series ?? [];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue(`--text-${this.theme}-color`);
    const surfaceBorder = documentStyle.getPropertyValue(`--border-${this.theme}-color`);
    const item = d.find((i: any) => i.samples.length) ?? [];
    const unit = item.unit;

    const labels = item?.samples?.length ? item?.samples.map((i: any) => i.offsetDateUnixTs) : [];

    let yMin = d?.length ? +item.min : 0;
    let yMax = d?.length ? +item.max : 0;
    let maxX = rez?.endDateUnixTs;

    d?.forEach((i: any) => {
      if (i.min && yMin > i.min) {
        yMin = i.min;
      }

      if (i.max && yMax < i.max) {
        yMax = i.max;
      }

      i.samples?.forEach((s: any) => {
        if (s.value && maxX < s.offsetDateUnixTs) {
          maxX = s.offsetDateUnixTs;
        }
      });
    });

    const add = (yMax - yMin) / 50;

    const step = (rez?.endDateUnixTs - rez?.startDateUnixTs)/(labels.length - 2);

    this.chartData = {
      labels: labels,
      datasets: labels.length ? d?.map((chart: any, index: number) => ({
          type: index ? 'line' : this.chartType,
          label: `${this.getData(chart.startDateUnixTs)} - ${this.getData(chart.endDateUnixTs)}`,
          borderWidth: 1.5,
          pointRadius: 0,
          inflateAmount: 2,
          backgroundColor: this.colorsService.getRGDAColor(index, 0.3),
          borderColor: this.colorsService.getColor(index),
          lineTension: 0,
          interpolate: true,
          data: [
            {
              labels: labels,
            },
            ...chart.samples.map((i: any) => ({
              x: i.offsetDateUnixTs,
              d: i.dateUnixTs,
              u: chart.unit,
              ...(!!i.value || i.value === 0) && {
                y: i.value,
              },
            })),
          ],
        }),
      ) : [],
    };

    this.options = {
      ...CHART_OPTIONS,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        ...CHART_OPTIONS.plugins,
        crosshair: {
          sync: {
            enabled: labels.length,
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
          },
        },
        title: {
          color: textColor,
          display: true,
          text: () => this.title[rez.meterType] && unit ? `${this.title[rez.meterType]} (${unit})` : '',
        },
        tooltip: {
          mode: 'index',
          trigger: 'selection',
          intersect: false,
          position: 'nearest',
          callbacks: {
            title: () => {
              return '';
            },
            label: (i: any) => {
              return `${this.getData(i.raw.d, 1)}: ${this.userNumberPipe
                .transform(i.raw.y, [this.thousandSeparator, this.decimalSeparator, 2])} ${i.raw.u}`;
            },
          },
        },
      },
      scales: {
        ...this.records && {
          x: {
            min: rez?.startDateUnixTs,
            max: maxX,
            ticks: {
              align: 'center',
              color: textColor,
              stepSize: step,
              maxRotation: 0,
              padding: 10,
              font: {
                weight: 500,
              },
              autoSkip: true,
              callback: (value: number) => {
                return ` ${this.getData(value, 1)} `;
              },
            },
            grid: {
              display: true,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
              color: surfaceBorder,
            },
          },
        },
        ...labels.length && {
          y: {
            min: Math.floor(yMin - add) > 0 ? Math.floor(yMin - add) : 0,
            max: Math.ceil(yMax + add),
            ticks: {
              color: textColor,
              callback: (index: number) => this.userNumberPipe
                .transform(index, [this.thousandSeparator, this.decimalSeparator]),
            },
            title: {
              display: true,
              color: textColor,
              text: unit,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      },
    };

    if (this.lineCanvas?.nativeElement) {
      if (!this.update) {
        this.update = true;
        this.chart = new Chart(this.lineCanvas.nativeElement, {
          type: 'scatter',
          data: this.chartData,
          options: this.options,
        });

        this.chart.update();

      } else {

        this.chart.data = this.chartData;
        this.chart.options = this.options;

        this.chart.update();
      }
    }
  }

  doubleClick(): void {
    if (this.chart.crosshair.button) {
      this.chart.crosshair.button.click();
    }
  }

  onChangeChartType(type: string): void {
    this.chartType = type;
    this.setChartData(this.records);
  }

  private getData(data: any, subtract: number | null = 0): string {
    return `${this.userDateFormatPipe
      .transform(data, this.records.tz, this.getDateTimeFormat, this.records.aggregationPeriod, subtract)}`;
  }
}
