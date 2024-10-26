import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UiStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { first, Observable, tap } from 'rxjs';

import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'concordia-ng-shared-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
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
export class LayoutComponent implements OnInit {
  @Input() menus!: Menu[];
  @Input() name = '';
  @Input() activeUrl!: string;
  @Input() customerName = '';
  @Input() logoFormat = 'png';
  @Input() helpPanel = false;
  @Input() apiVersion!: string;
  @Input() appVersion!: string;
  @Input() darkTheme = false;
  @Input() loading = false;
  @Input() helpMenu = true;

  @Output() logout = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<boolean>();

  showMenu$!: Observable<boolean>;
  hidePageElement$!: Observable<boolean>;
  theme$!: Observable<string>;
  showHelpPanel$!: Observable<boolean>;
  showHelpMenu$!: Observable<boolean>;

  constructor(
    private readonly uiStateService: UiStateService,
    private readonly userService: UserStateService,
  ) {
  }

  ngOnInit(): void {
    this.hidePageElement$ = this.uiStateService.hidePageElement();
    this.showMenu$ = this.uiStateService.showMenu();
    this.theme$ = this.userService.getUserTheme$();
    this.showHelpPanel$ = this.uiStateService.showHelpPanel();
    this.showHelpMenu$ = this.uiStateService.showHelpMenu();
  }

  onToggle(): void {
    this.uiStateService.toggleMenu();
  }

  logOut(): void {
    this.logout.emit();
  }

  userPage(): boolean {
    return !this.activeUrl?.includes('auth');
  }

  onToggleTheme(event: boolean): void {
    this.toggleTheme.emit(event);
  }

  onToggleHelpPanel(): void {
    this.uiStateService.toggleHelpPanel();

    this.uiStateService.showHelpPanel()
      .pipe(
        first(),
        tap(i => {
          if(i) {
            this.uiStateService.setHelpSubPage();
          }
        }),
      )
      .subscribe();
  }

  onToggleHelpMenu(): void {

    this.uiStateService.showRightMenu().pipe(
      first(),
    ).subscribe(i => {

      if (!i) {
        this.uiStateService.toggleHelpMenu();
      } else {
        this.uiStateService.toggleRightMenu();

        setTimeout(() => {
          this.uiStateService.toggleHelpMenu();
        }, 500);

      }
    });
  }

  closeRightMenuPanel(): void {
    this.uiStateService.closeRightMenuPanel();
  }
}
