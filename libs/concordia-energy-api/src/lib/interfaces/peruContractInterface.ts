import { MeterInterface } from './meterInterface';
import { SpainDistributorInterface } from './spainDistributorInterface';
import { SpainTariffInterface } from './spainTariffInterface';
import { SpainZoneInterface } from './spainZoneInterface';

export declare interface PeruContractInterface {

  _id?: string;
  meter: MeterInterface;
  meterContractId: string;
  fromDate: string;
  fromDateUnixTs: number;
  departmentId: string;
  zoneId: string;
  tariffId: string;
  distributorId: string;
  sellerId: string;
  voltage: number;
  contractedPower: number;
  energyPrice: number[];
  zone: SpainZoneInterface;
  tariff: SpainTariffInterface;
  distributor: SpainDistributorInterface;
  department: any;
}
