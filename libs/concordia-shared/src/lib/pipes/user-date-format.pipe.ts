import 'dayjs/locale/es';
import 'dayjs/locale/en';

import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

@Pipe({
  name: 'userDateFormat',
})
export class UserDateFormatPipe implements PipeTransform {
  constructor(
  ) {
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);
  }

  transform(value: string | null | number,
            tz: string | null = null,
            format: string | null = null,
            period: string | null = null,
            subtract: number | null = 0,
  ): string | null | number {

    const shotFormat = (period && period === 'day') ? format?.split(' ')[0] : format;

    // const isDay = tz && dayjs.tz(value, tz).format('HH:mm:ss').endsWith('00:00:00');

    const date = (period && period === 'day' && subtract) ? dayjs(value).subtract(1, 'days').valueOf() : value;

    return date && tz && shotFormat && format
      // ? (isDay ? dayjs.tz(date, tz).format(shotFormat) : dayjs.tz(date, tz).format(format))
      ? dayjs.tz(date, tz).format(shotFormat)
      : date;
  }
}
