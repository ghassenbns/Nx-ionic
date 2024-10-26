import { UserProfile, UserProfileInterface } from './user-config/user-profile';
import {
  UserSettings,
  UserSettingsInterface,
} from './user-config/user-settings';

export interface UserDataInterface {
  user_id: number;
  profile: UserProfileInterface;
  settings: UserSettingsInterface;
  user_type: string;
}

export class UserData {
  public userID: number;
  public profile: UserProfile;
  public settings: UserSettings;
  public userType: string;

  public constructor(params: UserDataInterface) {
    this.userID = params.user_id;
    this.profile = new UserProfile(params.profile);
    this.settings = new UserSettings(params.settings);
    this.userType = params.user_type;
  }
}
