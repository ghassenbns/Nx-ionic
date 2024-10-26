import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import * as dayjs from 'dayjs';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

@Component({
  selector: 'concordia-ng-shared-date-popover',
  templateUrl: './date-popover.component.html',
  styleUrls: ['./date-popover.component.scss'],
})
export class DatePopoverComponent {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  timePickerSeconds = true;
  singleDatePicker = true;
  timePicker24Hour = true;
  minDate: dayjs.Dayjs;
  minDateFull: string;
  maxDate: dayjs.Dayjs;
  maxDateFull: string;
  dateOffset: number;
  ranges = { };
  tz: any;

  locale = {
    applyLabel: this.translocoService.translate(`datepicker.apply`),
    daysOfWeek: dayjs.weekdaysShort(),
    monthNames: dayjs.months(),
    customRangeLabel: this.translocoService.translate(`datepicker.customRange`),
    firstDay: 1,
  };

  constructor(
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    public translocoService: TranslocoService,
  ) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(localeData);

    this.tz = this.navParams.get('tz');
    this.startDate = this.navParams.get('startDate');
    this.endDate = this.navParams.get('endDate');
    this.minDate = this.navParams.get('minDate');
    this.minDateFull = this.navParams.get('minDateFull');
    this.maxDate = this.navParams.get('maxDate');
    this.maxDateFull = this.navParams.get('maxDateFull');
    this.dateOffset = this.navParams.get('dateOffset');
    this.timePickerSeconds = this.navParams.get('hideSeconds');
    this.timePicker24Hour = this.navParams.get('timePicker24Hour');
    this.ranges = this.navParams.get('ranges');

    const today = this.translocoService.translate(`datepicker.today`);
    const yesterday = this.translocoService.translate(`datepicker.yesterday`);
    const lastWeek = this.translocoService.translate(`datepicker.lastWeek`);
    const lastDays = this.translocoService.translate(`datepicker.lastDays`);
    const thisMonth = this.translocoService.translate(`datepicker.thisMonth`);
    const lastMonth = this.translocoService.translate(`datepicker.lastMonth`);

    this.ranges = {
      [today]: [
        dayjs().utcOffset(this.tz).startOf('date').toDate(),
        dayjs().utcOffset(this.tz).endOf('date').toDate(),
      ],
      [yesterday]: [
        dayjs().subtract(1, 'days').utcOffset(this.tz).startOf('date').toDate(),
        dayjs().subtract(1, 'days').utcOffset(this.tz).endOf('date').toDate(),
      ],
      [lastWeek]: [
        dayjs().subtract(6, 'days').utcOffset(this.tz).startOf('date').toDate(),
        dayjs().utcOffset(this.tz).endOf('date').toDate(),
      ],
      [lastDays]: [
        dayjs().subtract(29, 'days').utcOffset(this.tz).startOf('date').toDate(),
        dayjs().utcOffset(this.tz).endOf('date').toDate(),
      ],
      [thisMonth]: [
        dayjs().utcOffset(this.tz).startOf('month'),
        dayjs().utcOffset(this.tz).endOf('month'),
      ],
      [lastMonth]: [
        dayjs().utcOffset(this.tz).subtract(1, 'month').startOf('month'),
        dayjs().utcOffset(this.tz).subtract(1, 'month').endOf('month'),
      ],
    };
  }

  chosenDate($event: any): void {
    this.cancel($event).then();
  }

  cancel(data: unknown = null): Promise<boolean> {
    return this.popoverCtrl.dismiss(data, 'cancel');
  }
}
