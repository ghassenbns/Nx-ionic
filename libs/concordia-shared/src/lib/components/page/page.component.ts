import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import {
  RouterStateService,
  UiStateService,
} from '@concordia-nx-ionic/concordia-core';
import { MenuController } from '@ionic/angular';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'concordia-ng-shared-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationTrigger', [
      transition(':enter', [
        style({ width: 0 }),
        animate('0.3s', style({ width: '400px' })),
      ]),
      transition(':leave', [
        animate('0.3s', style({ width: 0 })),
      ]),
    ]),
  ],
})
export class PageComponent implements OnInit, OnDestroy {
  @Input() header = '';
  @Input() rightMenu = false;
  @Input() helpMenu = true;
  @Input() card = false;
  @Input() cardHeight = '';

  activeUrl$!: Observable<string>;
  showRightPanel$!: Observable<boolean>;
  showRightMenu$!: Observable<boolean>;
  showHelpMenu$!: Observable<boolean>;
  helpPanel = false;

  private destroy$ = new Subject<void>();

  constructor(
    private menuCtrl: MenuController,
    private readonly uiStateService: UiStateService,
    private readonly route: ActivatedRoute,
    private readonly routerState: RouterStateService,
    private readonly config: ConfigService,
  ) {
  }

  ngOnInit(): void {
    this.helpPanel = this.config.getEnvironment()?.helpPanel;
    this.showRightPanel$ = this.uiStateService.showRightPanel();
    this.showRightMenu$ = this.uiStateService.showRightMenu();
    this.showHelpMenu$ = this.uiStateService.showHelpMenu();
    this.activeUrl$ = this.routerState.getUrl$().pipe(
      map(url => url
        .replace(/\//, '')
        .replace(/\//g, '_')),
      map(url => url.split('?')[0]),
    );

    if(this.helpMenu) {
      combineLatest([
        this.activeUrl$,
        this.route.data,
      ]).pipe(
        map(([url, data]) => {
          return data['helpPanel'] ?? url;
        }),
      ).pipe(
        takeUntil(this.destroy$),
        tap(page => {
          this.uiStateService.setHelpPage(page);
          this.uiStateService.setHelpSubPage();
        }),
      ).subscribe();
    }

    combineLatest([
      this.showRightMenu$,
      this.showHelpMenu$,
    ])
      .subscribe(([i, j]) => {
        if (i || j) {
          this.menuCtrl.open('trip-content').then();
        } else {
          this.menuCtrl.close('trip-content').then();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  closeRightMenuPanel(): void {
    this.uiStateService.closeRightMenuPanel();
  }

  setHelpPage(page = 'home'): void {
    this.uiStateService.setHelpPage(page);
  }

  onShowRightMenu(): void {
    this.uiStateService.toggleRightMenu();
  }

  onShowRightPanel(): void {
    this.uiStateService.toggleRightPanel();
  }
}
