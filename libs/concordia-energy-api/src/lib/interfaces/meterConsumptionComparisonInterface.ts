export declare interface MeterConsumptionComparisonInterface {
  series: any[],
  meterType: 'electricity' | 'heat',
  startDateUnixTs: number,
  endDateUnixTs: number,
  tz: string,
  aggregationPeriod: 'hour' | 'day' | 'quarter_hour',
}
