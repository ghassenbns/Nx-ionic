import { DecimalSeparator, ThousandSeparator } from './user-localization';

export declare interface UserInterface {
  email: string;
  name: string;
  phoneNumber: string;
  langEmail: string;
  userId: number;
  userLevelId: number;
  isActive: number;
  isVerified: number;
  usersLevel: {
    levelId: number;
    levelValue: number;
    name: number;
    masterLevels: {
      name: string;
    }
  };
  userPackages: any;
  profile: {
    address: string;
    avatarUrl: string;
    bannerUrl: string;
    email: string;
    firstName: string;
    lastName: string;
    occupation: string;
    phone: string;
    socialTwitter: string;
    website: string;
  };
  extra: {
    customReports: any,
    customMeterInfo: any,
  }
  settings: UserSettingsInterface,
}

export declare interface UserSettingsInterface {
  localization: UserSettingsLocalizationInterface,
  userInterface: UserSettingsInterfaceInterface,
}

export declare interface UserSettingsLocalizationInterface {
  dateTimeFormat: string;
  decimalSeparator: DecimalSeparator;
  thousandSeparator: ThousandSeparator;
  timezone: number;
  tz: string;
}

export declare interface UserSettingsInterfaceInterface {
  displayDensity: string;
  homeBackground: string;
  itemsPerPage: number;
  language: 'en_GB'
  logo: string;
  notifySound: string;
  theme: 'light' | 'dark';
  userMenuPosition: 'sidebar_navbar_menu';
}
