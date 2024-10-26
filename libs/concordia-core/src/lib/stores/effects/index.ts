import { AppEffects } from './app.effects';
import { AuthEffects } from './auth.effects';
import { RouterEffects } from './router.effects';
import { UiEffectsService } from './ui.effects.service';
import { UserEffects } from './user.effects';
import { VersionEffects } from './version.effects.service';

export const effects = [
  AppEffects,
  RouterEffects,
  AuthEffects,
  UserEffects,
  VersionEffects,
  UiEffectsService,
];

export * from './app.effects';
export * from './auth.effects';
export * from './router.effects';
export * from './ui.effects.service';
export * from './user.effects';
export * from './version.effects.service';
