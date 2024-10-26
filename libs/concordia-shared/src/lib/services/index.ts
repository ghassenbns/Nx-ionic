import { AlertService } from './alert.service';
import { MenuService } from './menu.service';

export const services = [
    MenuService,
    AlertService,
];

export * from './alert.service';
export * from './menu.service';
