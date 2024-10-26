import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { UiActions } from '../actions';
import * as fromUiSelectors from '../selectors/ui.selectors';

@Injectable()
export class UiStateService {

  constructor(private store: Store<never>) {
  }

  togglePageElements(): void {
    return this.store.dispatch(UiActions.togglePageElement());
  }

  hidePageElement(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectHidePageElement));
  }

  toggleMenu(): void {
    return this.store.dispatch(UiActions.toggleMenu());
  }

  showMenu(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectShowMenu));
  }

  toggleRightPanel(): void {
    return this.store.dispatch(UiActions.toggleRightPanel());
  }

  showRightPanel(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectShowRightPanel));
  }

  toggleRightMenu(): void {
    return this.store.dispatch(UiActions.toggleRightMenu());
  }

  showRightMenu(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectShowRightMenu));
  }

  showHelpPanel(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectShowHelpPanel));
  }

  showHelpMenu(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectShowHelpMenu));
  }

  toggleHelpPanel(): void {
    return this.store.dispatch(UiActions.toggleHelpPanel());
  }

  toggleHelpMenu(): void {
    return this.store.dispatch(UiActions.toggleHelpMenu());
  }

  closeRightMenuPanel(): void {
    return this.store.dispatch(UiActions.closeRightMenuPanel());
  }

  helpPanel(): Observable<string> {
    return this.store.pipe(select(fromUiSelectors.selectHelpPanel));
  }

  helpSubPanel(): Observable<string> {
    return this.store.pipe(select(fromUiSelectors.selectHelpSubPanel));
  }

  setHelpPage(page = 'home'): void {
    return this.store.dispatch(UiActions.setHelpPage({ page }));
  }

  setHelpSubPage(page = ''): void {
    return this.store.dispatch(UiActions.setHelpSupPage({ page }));
  }

  loadHelp(lang: string, page: string): void {
    return this.store.dispatch(UiActions.loadHelp({ lang, page }));
  }

  getHelpPage(lang: string, page: string): Observable<string> {
    return this.store.pipe(select(fromUiSelectors.selectHelp)).pipe(
      map(i => i[lang][page]),
    );
  }

  loadHelpError(): Observable<boolean> {
    return this.store.pipe(select(fromUiSelectors.selectHelpError));
  }
}
