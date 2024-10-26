import {
  Localization,
  LocalizationInterface,
} from './user-settings/localization';
import { IUserInterface, UserInterface } from './user-settings/user-interface';

export interface UserSettingsInterface {
  user_interface: IUserInterface;
  localization: LocalizationInterface;
}

export class UserSettings {
  public userInterface: UserInterface;
  public localization: Localization;

  constructor(params: UserSettingsInterface) {
    this.userInterface = new UserInterface(params.user_interface);
    this.localization = new Localization(params.localization);
  }
}
