import { Injectable } from '@angular/core';

import { Menu } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menus: Menu[] = [
    {
      title: 'landing',
      url: 'landing',
      ionicIcon: 'home-outline',
    },
    {
      title: 'fleets',
      canActivate: true,
      url: 'fleets',
      ionicIcon: 'bus-outline',
    },
    {
      title: 'drivers',
      canActivate: true,
      url: 'drivers',
      ionicIcon: 'man-outline',
    },
    {
      title: 'vehicles',
      canActivate: true,
      url: 'vehicles',
      ionicIcon: 'car-outline',
    },
    {
      title: 'trips',
      canActivate: true,
      url: 'trips',
      ionicIcon: 'analytics-outline',
    },
  ];

  getMenu(): Menu[] {
    return this.menus;
  }
}
