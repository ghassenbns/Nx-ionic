import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';

const MENU = [
  {
    title: 'vehicles',
    canActivate: true,
    url: 'vehicles',
    ionicIcon: 'car-outline',
  },
];

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get menu', () => {
    service.menus = MENU;
    expect(service.getMenu()).toBe(MENU);
  });
});
