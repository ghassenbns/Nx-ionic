import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import {
  UiStateService,
  UserStateService,
  VersionStateService,
} from '@concordia-nx-ionic/concordia-core';
import { combineLatest, filter, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'concordia-ng-shared-help-container',
  templateUrl: './help-container.component.html',
  styleUrls: ['./help-container.component.scss'],
})
export class HelpContainerComponent implements OnInit {
  helpPanel$!: Observable<string>;
  helpSubPanel$!: Observable<string>;
  lang$!: Observable<string>;
  theme$!: Observable<string>;
  helpData$!: Observable<string>;
  apiVersion$!: Observable<string>;

  appVersion!: string;

  constructor(
    private readonly uiStateService: UiStateService,
    private readonly userService: UserStateService,
    private readonly config: ConfigService,
    private readonly versionStateService: VersionStateService,
  ) {
  }

  ngOnInit(): void {
    this.helpPanel$ = this.uiStateService.helpPanel();
    this.helpSubPanel$ = this.uiStateService.helpSubPanel();
    this.lang$ = this.userService.getLocaleAbr$();
    this.theme$ = this.userService.getUserTheme$();
    this.appVersion = this.config.getAppVersion();
    this.apiVersion$ = this.versionStateService.getVersion();

    this.helpData$ = combineLatest([
      this.lang$,
      this.helpPanel$,
      this.helpSubPanel$,
    ]).pipe(
      filter(([lang, page]) => !!lang && !!page),
      switchMap(([lang, page, subPage]) => this.uiStateService.getHelpPage(lang, subPage ? subPage : page)),
    );
  }

  closeRightMenuPanel(): void {
    this.uiStateService.closeRightMenuPanel();
  }

  reset(): void {
    this.uiStateService.setHelpSubPage();
  }
}
