import { Injectable } from '@angular/core';
import {
  Router,
} from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

import { AppStateService } from '../stores/states';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private readonly state: AppStateService,
  ) {
  }

  canActivate(): Observable<boolean> | boolean {
    const token = this.oauthService.hasValidAccessToken();

    if (!token) {
      this.state.clean();
    }

    return token;
  }
}
