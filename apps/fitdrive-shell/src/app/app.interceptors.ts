import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import { first, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly notificationService: UINotificationStateService,
    private readonly translocoService: TranslocoService,
    private readonly state: AppStateService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => event, (err: any) => {
      if(err instanceof HttpErrorResponse) {

        // todo delete 500
        if(err.status === 500 || err.status === 401) {
          this.state.clean();

        } else {
          if(err.error.code) {
            this.translocoService.selectTranslate(`COMMON_SERVER_ERRORS.${err.error.code}`)
              .pipe(
                first(),
              )
              .subscribe(value => {
                const message = !value || value.startsWith('COMMON_SERVER_ERRORS')
                  ? err.error.message || err.message
                  : value;

                this.notificationService.error(message);
              });
          }
        }
      }
    }));
  }
}
