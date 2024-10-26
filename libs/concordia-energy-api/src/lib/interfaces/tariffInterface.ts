import { TariffRateInterface } from './tariffRateInterface';

export declare interface TariffInterface {
  _id: string;
  departmentId: number;
  departmentName: string;
  zone: string;
  date: string;
  mongodate: string;
  mongodateUnixTs: number;
  locale: string;
  timezone: string;
  rates: TariffRateInterface[];
}
