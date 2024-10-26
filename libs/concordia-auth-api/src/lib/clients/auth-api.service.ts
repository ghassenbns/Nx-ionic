import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { OAuthService } from 'angular-oauth2-oidc';
import jwtDecode from 'jwt-decode';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginResponseDataInterface } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private oauthService: OAuthService,
  ) { }

  login(username: string, password: string): Observable<LoginResponseDataInterface> {

    this.oauthService.initCodeFlow();
    this.oauthService.configure(this.config.getEnvironment().authCodeFlowConfig);

    return from(this.oauthService.fetchTokenUsingPasswordFlow(username, password)).pipe(
      map((response: LoginResponseDataInterface) => {
        return response;
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.config.getEnvironment().authCodeFlowConfig.logoutEndpoint, {}).pipe(
      map((response: any) => {
        return response;
      }),
    );
  }

  getUserToken(): string {
    return this.oauthService.getAccessToken();
  }

  getUserTokenInfo(): any {
    return jwtDecode(this.oauthService.getAccessToken());
  }
}
