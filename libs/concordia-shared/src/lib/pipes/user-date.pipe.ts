import 'dayjs/locale/es';
import 'dayjs/locale/en';

import { Pipe, PipeTransform } from '@angular/core';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { combineLatest, filter, map, Observable } from 'rxjs';

@Pipe({
  name: 'userDate',
})
export class UserDatePipe implements PipeTransform {
  constructor(
    private readonly userState: UserStateService,
  ) {
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);
  }

  transform(value: string | null | number | number[],
            customTimeZone: string | null = null): Observable<string> {

    const tz$ = this.userState.getTZ$();
    const format$ = this.userState.getDateTimeFormat$();
    const locale$ = this.userState.getLocale$();

    return combineLatest([
      tz$,
      format$,
      locale$,
    ]).pipe(
      filter(([tz, format, locale]) => !!tz && !!format && !!locale),
      map(([tz, format, locale]) => {
        if (locale) {
          const l = locale.split('_')[0];
          dayjs.locale(l);
        }

        const f = typeof format === 'string' && format.includes('_12h')
          ? format.replace('_12h', ' a')
          : format;

        const auxTz = customTimeZone || tz;
        return value && typeof value === 'object' && value.length === 2
          ? `${this.getDate(value[0], auxTz, f)} - ${this.getDate(value[1], auxTz, f)}`
          : value && typeof value === 'object'
            ? this.getDate(value[0], auxTz, f)
            : this.getDate(value, auxTz, f);
      }),
    );
  }

  getDate(date: any, tz: any, f: string | null): string {
    return tz && f && date && dayjs(date).isValid()
      ? dayjs.tz(date, tz).format(f)
      : date;
  }
}
