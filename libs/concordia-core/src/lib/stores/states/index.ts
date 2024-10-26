import { AppStateService } from './app.state';
import { AuthService } from './auth.service';
import { RouterStateService } from './router.state';
import { ThemeService } from './theme.service';
import { UiStateService } from './ui.state';
import { UserStateService } from './user.state';
import { VersionStateService } from './version.state';

export const states: any[] = [
  AppStateService,
  RouterStateService,
  UserStateService,
  AuthService,
  UiStateService,
  VersionStateService,
  ThemeService,
];

export * from './app.state';
export * from './auth.service';
export * from './router.state';
export * from './theme.service';
export * from './ui.state';
export * from './user.state';
export * from './version.state';
