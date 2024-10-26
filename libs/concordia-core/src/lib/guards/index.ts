import { AccessGuard } from './access.guard';
import { AuthGuard } from './auth.guard';

export const guards = [
  AuthGuard,
  AccessGuard,
];

export * from './access.guard';
export * from './auth.guard';
