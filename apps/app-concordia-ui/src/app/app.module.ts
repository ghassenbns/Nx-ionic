import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ConcordiaApiStoreModule } from '@concordia-nx-ionic/concordia-api-store';
import { ConcordiaConfigModule } from '@concordia-nx-ionic/concordia-config';
import { ConcordiaCoreModule, effects, ROOT_REDUCERS } from '@concordia-nx-ionic/concordia-core';
import { SharedModule } from '@concordia-nx-ionic/concordia-shared';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastrModule } from 'ngx-toastr';

import packageInfo from '../../package.json';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ResponseInterceptor } from './app.interceptors';
import { appRoutes } from './app.routes';
import { containers } from './containers';
import { CustomRouterStateSerializer } from './serializers';
import { TranslocoRootModule } from './transloco-root.module';
// We need a factory, since localStorage is not available during AOT build time.
export function storageFactory() : OAuthStorage {
  return localStorage;
}

@NgModule({
  declarations: [AppComponent, ...containers],
  imports: [
    BrowserModule,
    LoadingBarHttpClientModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    TranslocoRootModule,
    BrowserAnimationsModule,

    StoreModule.forRoot(ROOT_REDUCERS),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
    }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    //? enables the Redux DevTools for monitoring and debugging the state.

    SharedModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [
          environment.config.apiUrl,
          environment.authCodeFlowConfig.logoutEndpoint,
        ],
        sendAccessToken: true,
      },
    }),
    ConcordiaConfigModule.forRoot(environment, packageInfo.version),
    ConcordiaCoreModule.forRoot(),
    ToastrModule.forRoot(),
    ConcordiaApiStoreModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
    { provide: OAuthStorage, useFactory: storageFactory },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
