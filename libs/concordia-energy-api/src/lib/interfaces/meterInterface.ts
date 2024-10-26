import { TimezoneInterface } from '@concordia-nx-ionic/concordia-api';

export declare interface MeterInterface {
  _id: string;
  name: string;
  description: string;
  ref: string;
  logo?: string;
  customInfo: {
    customInfoTypeId: string;
    name: string;
    value: string | number;
  }[];
  ownerId: number;
  owner: {
    userId: number;
    name: string;
    email: string;
    userLevelId: number;
    creatorUserId: number;
  };
  isPublic: boolean;
  timezoneId: number;
  clientId: string;
  meterType: string;
  country: string;
  localization: {
    address: string;
    latitude: number;
    longitude: number;
  };
  customInfoEnabled: boolean;
  latestTariffEnabled: boolean;
  isEditable: boolean;
  isDeletable: boolean;
  timezone: TimezoneInterface;
}
