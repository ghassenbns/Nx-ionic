export interface LocalizationInterface {
  timezone: number;
  date_time_format: Date;
  thousand_separator: string;
  decimal_separator: string;
  timezone_short_name: string;
}

export class Localization {
  timeZone: number;
  dateTimeFormat: Date;
  thousandSeparator: string;
  decimalSeparator: string;
  timezoneShortName: string;

  public constructor(params: LocalizationInterface) {
    this.timeZone = params.timezone;
    this.dateTimeFormat = params.date_time_format;
    this.thousandSeparator = params.thousand_separator;
    this.decimalSeparator = params.decimal_separator;
    this.timezoneShortName = params.timezone_short_name;
  }
}
