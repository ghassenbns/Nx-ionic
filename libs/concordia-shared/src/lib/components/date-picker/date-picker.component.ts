import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { IonInput, PopoverController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SelectOption } from '../../interfaces';
import { DatePopoverComponent } from '../date-popover/date-popover.component';

@Component({
  selector: 'concordia-ng-shared-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @ViewChild(NgModel) ngModel!: NgModel;
  @ViewChild('input') input!: IonInput;

  @Input() label = '';
  @Input() name = '';
  @Input() errorText = '';
  @Input() placeholder = '';
  @Input() fill = '';
  @Input() rowSelector = '';
  @Input() optionsField = 'name';
  @Input() filterRange = false;
  @Input() optionsValue = '';
  @Input() optionsGroup = '';

  @Input() required = false;
  @Input() validators: any[] = [];
  @Input() disabled = false;
  @Input() hideSeconds = false;
  @Input() minDateFull: any;
  @Input() maxDateFull: any;
  @Input() dateOffset: number | undefined;
  @Input() minDateOffset: number | undefined;

  @Input() options!: SelectOption[];

  private _innerModel!: null | number | number[];

  get model(): null | number | number[] {
    return this._innerModel;
  }

  set model(newValue: null | number | number[]) {
    this._innerModel = newValue;
    this.onChange(this._innerModel);
  }

  private _setTouched!: boolean | null;

  @Input() get setTouched(): any {
    return this._setTouched;
  }

  set setTouched(newValue: any) {
    this._setTouched = newValue;

    if (newValue) {
      this.ngModel.control.markAsTouched();
    }
  }

  @Input() customTimezone: string | null = null;

  @Output() changeValue = new EventEmitter<any>();

  timePicker24Hour = true;
  tz!: string;
  format$: Observable<string | null>;
  now: any;
  diff = 0;

  constructor(
    public popoverController: PopoverController,
    private readonly userState: UserStateService,
    public translocoService: TranslocoService,
  ) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);
    this.format$ = this.userState.getDateTimeFormat$()
      .pipe(
        tap((format: string | null) => {
          this.timePicker24Hour = !(format?.includes('_12h') || format?.includes(' a'));
        }),
      );
  }

  ngOnInit(): void {
    this.userState.getTZ$()
      .pipe(
        tap((tz: string | null) => {
          if (tz) {
            this.tz = this.customTimezone || tz;
            this.diff = dayjs().utcOffset() / 60 - dayjs.tz(dayjs(), this.tz).utcOffset() / 60;
            this.now = dayjs().utcOffset(this.tz).startOf('minutes');
          }
        }),
      ).subscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {
  };

  writeValue(obj: null | number | number[]): void {
    this._innerModel = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(): any {
    if (!this.required && !this.model) {
      return null;
    }

    if (this.minDate() && this.model && typeof this.model === 'number'
      && dayjs(this.model).diff(dayjs(this.minDate()), 'minute') < 0) {

      return { minDate: true };
    }

    if (this.maxDateFull && this.model && typeof this.model === 'number'
      && dayjs(this.model).diff(dayjs(this.maxDateFull), 'minute') > 0) {

      return { maxDate: true };
    }

    return typeof this.model === 'number' && dayjs(this.model).isValid()
    || typeof this.model === 'object' && this.model?.length === 2
    && dayjs(this.model[0]).isValid() && dayjs(this.model[1]).isValid()
      ? null : { date: true };
  }

  getOptionsValue(): string {
    return this.optionsValue || '_id';
  }

  async presentPopover(e: Event): Promise<void> {
    if (this.disabled) {
      return;
    }

    const popover = await this.popoverController.create({
      component: DatePopoverComponent,
      componentProps: {
        startDate: this.getDate(this.model, true),
        endDate: this.getDate(this.model, false),
        timePicker24Hour: this.timePicker24Hour,
        singleDatePicker: !this.filterRange,
        tz: this.tz,
        timePickerSeconds: !this.hideSeconds,
        dateOffset: this.dateOffset,
        minDateFull: this.minDateFull ?? this.minDate(),
        minDate: this.minDateFull
          ? dayjs(this.minDateFull).utcOffset(this.tz).subtract(this.diff, 'hours').format('MM/DD/YYYY HH:mm:ss')
          : this.minDate()
            ? dayjs(this.minDate()).utcOffset(this.tz).subtract(this.diff, 'hours').format('MM/DD/YYYY HH:mm:ss')
            : null,
        maxDateFull: this.maxDateFull,
        maxDate: this.maxDateFull
          ? dayjs(this.maxDateFull).utcOffset(this.tz).subtract(this.diff, 'hours').format('MM/DD/YYYY HH:mm:ss')
          : null,
      },
      event: e,
      showBackdrop: false,
      cssClass: this.filterRange ? 'date-popover' : '',
    });

    await popover.present();

    const eventDetail = await popover.onDidDismiss();

    if (eventDetail.data) {
      this.setValue(eventDetail.data);
    } else {
      this.input.setFocus().then();
    }
  }

  setValue(val: any): void {
    const diffStartDate = dayjs.tz(dayjs(val?.startDate), this.tz).utcOffset() / 60;

    const diffEndDate = dayjs.tz(dayjs(val?.endDate), this.tz).utcOffset() / 60;

    const value = !val ? null : this.filterRange
      ? [dayjs(val?.startDate).subtract(diffStartDate, 'hours').valueOf(),
        dayjs(val?.endDate).subtract(diffEndDate, 'hours').valueOf()]
      : dayjs(val?.startDate).subtract(diffStartDate, 'hours').valueOf();

    this._innerModel = value;
    this.onChange(value);
    this.changeValue.emit(value);
    this.input.setFocus().then();
  }

  setTypeValue(val: any): void {
    this._innerModel = val;
    this.onChange(val);
    this.changeValue.emit(val);
    this.input.setFocus().then();
  }

  close($event: any, format: string): void {
    if (!$event.detail.value) {
      this.setValue(null);
    } else {
      const values = $event.detail.value?.split(' - ');

      const value = this.filterRange
        ? [this.setDate(values[0], format), this.setDate(values[1], format)]
        : this.setDate(values[0], format);

      this.setTypeValue(value);
    }
  }

  setDate(date: any, format: string): any {
    const diff = dayjs().utcOffset() / 60 - dayjs.tz(dayjs(), this.tz).utcOffset() / 60;

    return dayjs(date, format, true).isValid()
      ? dayjs(date, format, true).add(diff, 'hours').valueOf()
      : date;
  }

  getDate(data: number | number[] | any, start = true): any {
    if (!data || typeof data === 'object' && data.length === 1
      || typeof data === 'object' && !dayjs(data[start ? 0 : 1]).isValid()) {

      return this.minDate()
        ? dayjs(this.minDate()).subtract(this.diff, 'hours')
          .add(this.dateOffset ?? 0, 'hours').subtract(this.dateOffset ? 1 : 0, 'minute')
        : this.now.subtract(this.diff, 'hours').add(this.dateOffset ?? 0, 'hours');
    }
    const auxTz = this.tz || dayjs.tz.guess();
    const date = typeof data === 'number'
      ? dayjs.tz(data, auxTz)
      : dayjs.tz(data[start ? 0 : 1] ?? data, auxTz);

    return date.isValid()
      ? date.subtract(this.diff, 'hours')
      : this.now.subtract(this.diff, 'hours');
  }

  minDate(): number | null {
    return this.minDateFull ?? (this.minDateOffset || this.minDateOffset === 0
      ? this.now.add(this.minDateOffset || 0, 'hours').startOf('minutes').valueOf()
      : null);
  }

  minDateSub(): dayjs.Dayjs {
    return dayjs(this.minDate()).subtract(this.diff, 'hours');
  }
}
