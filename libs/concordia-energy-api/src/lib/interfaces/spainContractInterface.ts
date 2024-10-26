import { MeterInterface } from './meterInterface';
import { SpainBillingTypeInterface } from './spainBillingTypeInterface';
import { SpainDistributorInterface } from './spainDistributorInterface';
import { SpainSellerInterface } from './spainSellerInterface';
import { SpainTariffInterface } from './spainTariffInterface';
import { SpainZoneInterface } from './spainZoneInterface';

export declare interface SpainContractInterface {

  _id?: string;
  meter: MeterInterface;
  meterContractId: string;
  fromDate: string;
  fromDateUnixTs: number;
  zoneId: string;
  tariffId: string;
  billingTypeId: string;
  distributorId: string;
  sellerId: string;
  voltage: number;
  contractedPower: number[];
  energyPrice: number[];
  zone: SpainZoneInterface;
  billingType: SpainBillingTypeInterface;
  tariff: SpainTariffInterface;
  distributor: SpainDistributorInterface;
  seller: SpainSellerInterface;

}
