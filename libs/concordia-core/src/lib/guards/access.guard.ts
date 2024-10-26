import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';

import { RightEnum } from '../enum';
import { AppStateService, RouterStateService } from '../stores/states';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard {
  constructor(
    private readonly appStateService: AppStateService,
    private readonly routerState: RouterStateService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    return this.appStateService.hasRight$(RightEnum.READ, route.routeConfig?.path, route.parent?.routeConfig?.path)
      .pipe(
        map((right: boolean) => {

          if(right) {
            return true;
          } else {
            this.routerState.navigate(['/landing']);
          }

          return false;
        }),
      );
  }
}
