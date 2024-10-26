import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

@Directive({
  selector: '[concordiaNxIonicDateValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true }],
})
export class DateValidatorDirective implements Validator {
  @Input('concordiaNxIonicDateValidator') params: any[] = [];

  constructor() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);
  }

  validate(control: AbstractControl): ValidationErrors|null {

    const minDate = this.params[0];
    const maxDate = this.params[1];
    const format = this.params[2];
    const diff = this.params[3];

    const range = control.value?.split(' - ');

    if(control.value && (!range && !dayjs(control.value, format, true).isValid()
      || range?.length && (range[0] && !dayjs(range[0], format, true).isValid()
      || range[1] && !dayjs(range[1], format, true).isValid()))) {

      return { date: false };
    }

    if(minDate && range && dayjs(range[0], format, true).isValid()
      && dayjs(range[0], format, true).diff(dayjs(minDate), 'minute') < 0) {

      return { minDate: true };
    }

    if(maxDate && range && !range[1] && dayjs(range[0], format, true).isValid()
      && dayjs(range[0], format, true).add(diff, 'hours').diff(dayjs(maxDate), 'minute') > 0) {

      return { maxDate: true };
    }

    return null;
  }
}
