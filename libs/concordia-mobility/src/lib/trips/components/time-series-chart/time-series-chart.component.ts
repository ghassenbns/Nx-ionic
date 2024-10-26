import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  VehicleDataInterface,
  VehicleSignalTypeInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { TripStateService } from '@concordia-nx-ionic/concordia-mobility-store';
import { CHART_OPTIONS } from '@concordia-nx-ionic/concordia-shared';
import { Chart } from 'chart.js';
import * as dayjs from 'dayjs';

@Component({
  selector: 'concordia-nx-ionic-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.scss'],
})
export class TimeSeriesChartComponent implements AfterContentInit {
  @ViewChild('barCanvas') public barCanvas!: ElementRef;

  @HostListener('mouseenter', ['$event']) onMouseover(): void {
    this.active = true;
  }

  @HostListener('mouseleave', ['$event']) onMouseleave(): void {
    this.active = false;
    this.selectTime.emit(null);
  }

  @Input() vehicleSignalTypeName = '';
  @Input() group: VehicleSignalTypeInterface[] | null = [];
  @Input() loading = false;
  @Input() title = '';
  @Input() label = '';
  @Input() hidden: string[] = [];
  @Input() type = 'line';
  @Input() colors: { backgroundColor: string, borderColor: string }[] = [];
  @Input() stats!: any;

  _format = '';

  public chart: any;

  @Input() set format(d: string) {
    this._format = d;

    if (this.data?.length) {
      this.setChartData(this.data);
    }
  }

  get format(): string {
    return this._format;
  }

  _data: VehicleDataInterface[] = [];
  @Input() set data(d: VehicleDataInterface[]) {
    this._data = d;

    if (this.format) {
      this.setChartData(d);
    }
  }

  get data(): VehicleDataInterface[] {
    return this._data;
  }

  _theme = 'light';
  @Input() set theme(t: string) {
    this._theme = t;

    if (this.format && this.data) {
      this.setChartData(this.data);
    }
  }

  get theme(): string {
    return this._theme;
  }

  _linkedTime: number | null = null;

  @Input() set linkedTime(d: number | null) {
    this._linkedTime = d;

    if (this.chartData && !this.active) {
      if (d) {
        this.showT(this.chartData, d);
      } else if (this.chart) {
        this.hideT();
      }
    }
  }

  get linkedTime(): number | null {
    return this._linkedTime;
  }

  @Input() set zoomTime(d: number | null) {
    this.onZoomTime(d);
  }

  @Output() selectEvent = new EventEmitter<string>();
  @Output() selectTime = new EventEmitter<number | null>();

  chartData: any = {
    labels: [],
    datasets: [],
  };

  options: any;

  private update = false;
  private active = false;

  constructor(
    public readonly tripStateService: TripStateService,
  ) {
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.data.length) {
        this.setChartData(this.data);
      }
    }, 0);
  }

  setChartData(data: VehicleDataInterface[]): void {
    const filteredD = data.filter((i) => !this.hidden.includes(i.type));
    const hiddenDate: any = data.find((i) => this.hidden.includes(i.type));
    const count = filteredD?.reduce((acc: number, key: any) => acc + (key.stats.max - key.stats.min), 0);
    const side = filteredD?.map(d => Math.round((d.stats.max - d.stats.min) / count));
    const oneAxis = [...new Set(side)].length > 1;

    if (filteredD?.length > 0) {
      const dates: number[] = filteredD.reduce((acc: any, key: any) => {
        key.samples.forEach((i: any) => acc.push(i.date));
        return acc;
      }, []);

      const labels: string[] = [...new Set(dates.map((i: any) => i).sort())];
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue(`--text-${this.theme}-color`);
      const surfaceBorder = documentStyle.getPropertyValue(`--border-${this.theme}-color`);

      this.options = {
        ...CHART_OPTIONS,
        crosshair: {
          sync: {
            enabled: true,
          },
        },
        transitions: {
          active: {
            animation: {
              duration: 0,
            },
          },
        },
        plugins: {
          ...CHART_OPTIONS.plugins,
          legend: {
            display: oneAxis,
            labels: {
              color: textColor,
            },
          },
          title: {
            color: textColor,
            display: !!this.label,
            text: () => this.label,
          },
          tooltip: {
            mode: 'index',
            trigger: 'selection',
            intersect: false,
            callbacks: {
              title: (i: any) => {
                if (this.active) {
                  this.selectTime.emit(+i[0].raw.x ?? null);
                }

                return `${this.getDate(filteredD[0].date, filteredD, true)} ${this.getDate(+i[0].raw.x, filteredD)}`;
              },
              footer: (i: any) => {
                if (!hiddenDate) {
                  return '';
                }

                const label = +i[0]?.raw.x;

                const values = label && hiddenDate?.samples
                  .filter((j: any) => j.date <= label) || [];

                const value = values[values.length - 1]?.value - hiddenDate?.samples[0].value;

                return `${hiddenDate?.alias}: ${value || value === 0 ? value + hiddenDate?.unit?.htmlSymbol : 'n/a'}`;
              },
            },
          },
        },
        scales: {
          x: {
            min: labels[0],
            max: labels[labels.length - 1],
            ticks: {
              color: textColor,
              callback: (index: number) => this.getDate(index, filteredD),
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            min: this.stats?.y?.min || this.stats?.y?.min === 0 ? this.stats?.y?.min : null,
            max: this.stats?.y?.max ? this.stats?.y?.max : null,
            title: {
              display: true,
              color: textColor,
              text: [...new Set(filteredD.map((i, index) => !side[index] || !oneAxis ? i.unit.htmlSymbol : ''))]
                .filter(i => !!i)
                .join(', '),
            },
            ticks: {
              color: textColor,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          ...(side.length && oneAxis) && {
            y1: {
              labelString: 'y2',
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false,
                color: surfaceBorder,
              },
              title: {
                display: true,
                text: [...new Set(filteredD.map((i, index) => side[index] ? i.unit.htmlSymbol : ''))]
                  .filter(i => !!i)
                  .join(', '),
              },
              ticks: {
                color: textColor,
              },
            },
          },
        },
      };

      this.chartData = {
        labels: labels,
        datasets: filteredD.map((chart: any, index: number) => ({
            type: 'line',
            label: chart.alias,
            borderWidth: 1.5,
            pointRadius: 0,
            inflateAmount: 2,
            fill: this.type === 'fill' ? 'origin' : -1,
            backgroundColor: this.colors.length && this.colors[index].backgroundColor
              ? this.colors[index].backgroundColor : '',
            borderColor: this.colors.length && this.colors[index].borderColor
              ? this.colors[index].borderColor : '',
            data: [
              {
                labels: chart.samples.map((i: any) => i.date),
              },
              ...chart.samples.map((i: any) => ({
                x: i.date,
                y: i.value,
              })),
            ],
            yAxisID: side[index] && oneAxis ? `y1` : 'y',
          }),
        ),
      };

      if (this.barCanvas?.nativeElement) {
        if (!this.update) {
          this.update = true;
          this.chart = new Chart(this.barCanvas.nativeElement, {
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
  }

  onSelect($event: any): void {
    if ($event?.detail.value) {
      this.selectEvent.emit($event?.detail.value);
    }
  }

  getDate(date: number, data: any[], day = false): string {
    let oneDay = false;
    let dateFormat = '';
    let timeFormat = '';

    if (data?.length) {
      oneDay = !dayjs(data[0].date).diff(data[data.length - 1].date, 'day');
    }

    const formats = this.format?.split(' ');

    if (formats?.length) {
      dateFormat = oneDay ? formats[0] : '';
      timeFormat = oneDay ? formats[1] : this.format || '';
    }

    return this.format
      ? day
        ? dayjs(date).format(dateFormat).toString()
        : dayjs(date).format(timeFormat).toString()
      : '';
  }

  hideT(): void {
    const tooltip = this.chart.tooltip;
    tooltip.setActiveElements([], { x: 0, y: 0 });
    this.chart.update();
  }

  showT(options: any, linkedTime: number | null): void {
    if (linkedTime && options?.datasets[0]?.data?.length) {
      const index = options.datasets[0]?.data?.filter((i: any) => i.x <= linkedTime).length;

      if (index) {
        const tooltip = this.chart.tooltip;

        const chartArea = this.chart.chartArea;

        if(tooltip?.x) {
          tooltip.setActiveElements([
              {
                datasetIndex: 0,
                index: index,
              },
            ],
            {
              x: (chartArea.left + chartArea.right) / 2,
              y: (chartArea.top + chartArea.bottom) / 2,
            });

          this.chart.update();
        }
      }
    }
  }

  onZoomTime(d: number | null): void {
    if(this.chart?.data?.labels) {
      const labels = this.chart.data.labels;

      const index = d ? labels?.filter((i: number) => d >= i).length : 0;

      if(index && labels[index]) {
        const min = dayjs(labels[index]).subtract(1, 'minute').valueOf();
        const max = dayjs(labels[index]).add(1, 'minute').valueOf();

        this.chart.options.scales.x.min = min;
        this.chart.options.scales.x.max = max;

      } else {
        this.chart.options.scales.x.min = labels[0];
        this.chart.options.scales.x.max = labels[labels.length - 1];

      }

      this.chart.update();
    }
  }

  doubleClick(): void {
    this.tripStateService.toggleZoomTime(0);

    if(this.chart.crosshair.button){
      this.chart.crosshair.button.click();
    }
  }
}
