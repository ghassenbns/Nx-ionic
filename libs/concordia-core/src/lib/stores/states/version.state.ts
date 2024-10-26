import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { VersionActions } from '../actions';
import * as fromVersionsSelectors from '../selectors/version.selectors';

@Injectable()
export class VersionStateService {
  constructor(private store: Store<never>) {
  }

  loadVersion(): void {
    this.store.dispatch(VersionActions.loadVersion());
  }

  getVersion(): Observable<string> {
    return this.store.pipe(select(fromVersionsSelectors.selectVersion));
  }

}
