import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, first, map, Observable } from 'rxjs';

import { HierarchiesActions } from '../actions';
import * as fromHierarchiesSelectors from '../selectors/hierarchies.selectors';

@Injectable()
export class HierarchiesStateService {
  constructor(private store: Store<never>) {
  }

  loadHierarchiesList(): void {
    this.store.pipe(select(fromHierarchiesSelectors.selectHierarchiesList))
      .pipe(
        first(),
        filter(hierarchies => !hierarchies.length),
      )
      .subscribe(() => {
        this.store.dispatch(HierarchiesActions.loadHierarchiesList());
      });
  }

  getHierarchiesList(): Observable<any[]> {
    return this.store.pipe(select(fromHierarchiesSelectors.selectHierarchiesList));
  }

  getHierarchiesListLoading(): Observable<boolean> {
    return this.store.pipe(select(fromHierarchiesSelectors.selectHierarchiesListPending));
  }

  loadHierarchiesIdList(hierarchiesId: any): void {
    if (hierarchiesId) {
      this.store.pipe(select(fromHierarchiesSelectors.selectHierarchiesEntities))
        .pipe(
          first(),
          map(hierarchies => hierarchies[hierarchiesId]),
          filter(hierarchies => !hierarchies),
        )
        .subscribe(() => {
          this.store.dispatch(HierarchiesActions.loadHierarchies({
            hierarchyId: hierarchiesId,
          }));
        });
    }
  }

  getHierarchiesIdList(id: string | null): Observable<any> {
    return this.store.pipe(select(fromHierarchiesSelectors.selectHierarchiesEntities)).pipe(
      map(i => id ? i[id] : null),
    );
  }

  getHierarchiesIdListLoading(): Observable<boolean> {
    return this.store.pipe(select(fromHierarchiesSelectors.selectHierarchiesLoadPending));
  }

  setSelectedHierarchies(hierarchyId: string | null): void {
    return this.store.dispatch(HierarchiesActions.setSelectedHierarchies({ hierarchyId: hierarchyId }));
  }

  getSelectedHierarchies(): Observable<string | null> {
    return this.store.pipe(select(fromHierarchiesSelectors.selectSelectedHierarchies));
  }
}
