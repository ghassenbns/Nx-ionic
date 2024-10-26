import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import * as dayjs from 'dayjs';

@Directive({
  selector: '[concordiaNxIonicValidAggregationPeriod]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidAggregationPeriodDirective, multi: true }],

})
export class ValidAggregationPeriodDirective {
  validate(control: AbstractControl): ValidationErrors|null {
    const dataRange = control?.parent?.value?.dateRange;

    if(dataRange?.length) {
      const month = (dayjs(dataRange[1])).diff(dataRange[0], 'month');
      const day = dayjs(dataRange[1]).diff(dataRange[0], 'day');

      if( !(control.value === 'day' && (day && month < 2))
        && !(control.value === 'quarter_hour' && month < 1)
        && !(control.value === 'hour' && month < 2)) {
        return { aggregationPeriod: false };
      }
    }

    return null;
  }
}
