import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Status } from '../../interfaces';
import { AuthActions } from '../actions';
import { selectAuthStatus } from '../selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private readonly store: Store<any>) {
  }

  login(data: any): void {
    this.store.dispatch(AuthActions.login({ ...data }));
  }

  logout(endUrl: boolean): void {
    this.store.dispatch(AuthActions.logout({ endUrl }));
  }

  getStatus$(): Observable<Status> {
    return this.store.pipe(select(selectAuthStatus));
  }
}
