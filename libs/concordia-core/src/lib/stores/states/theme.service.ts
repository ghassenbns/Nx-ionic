import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserActions } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly store: Store<any>,
    ) {
  }

  setTheme(theme = 'light'): void {
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `md-${theme}-indigo.css`;
      document.body.classList.toggle('dark', theme === 'dark');
    }
  }

  toggleTheme(userId: number, darkTheme: boolean): void {
    this.store.dispatch(UserActions.updateUserInterface({ userId, theme: darkTheme ? 'dark' : 'light' }));
  }
}
