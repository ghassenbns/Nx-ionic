import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { UserInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import {
  AppStateService,
  AuthService,
  RightEnum,
  RouterStateService,
  Status,
  ThemeService,
  UserStateService,
  VersionStateService,
} from '@concordia-nx-ionic/concordia-core';
import { Menu } from '@concordia-nx-ionic/concordia-shared';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainerComponent implements OnInit {
  activeUrl$!: Observable<string>;
  apiVersion$!: Observable<any>;
  theme$!: Observable<string>;
  status$!: Observable<Status>;
  appVersion!: string;
  menus$!: Observable<Menu[]>;

  customerName!: string;
  user$!: Observable<UserInterface | null>;
  accessToken!: string | null;
  changed = false;
  helpPanel = false;

  private menus: Menu[] = [
    {
      title: 'landing',
      url: 'landing',
      ionicIcon: 'home-outline',
    },
    {
      title: 'energy',
      url: 'energy',
      ionicIcon: 'flash-outline',
      children: [
        {
          title: 'meters',
          url: 'energy/meters',
        },
        {
          title: 'consumption_comparison',
          url: 'energy/meters/consumption_comparison',
        },
        {
          title: 'hierarchies',
          url: 'energy/meters/hierarchies',
        },
      ],
    },
  ];

  @HostListener('document:visibilitychange')
  changeVisibility(): void {
    if (!document.hidden && this.changed) {
      window.location.reload();
      this.changed = false;
    } else {
      this.changed = false;
    }
  }

  @HostListener('window:storage', ['$event'])
  changeStorage(event: StorageEvent): void {
    if (event.key === 'access_token') {
      this.accessToken = event.newValue;

      if (document.hidden) {
        this.changed = true;
      } else {
        this.updatePage(this.accessToken);
      }
    }
  }

  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserStateService,
    private readonly themeService: ThemeService,
    private readonly routerState: RouterStateService,
    private readonly state: AppStateService,
    private readonly versionStateService: VersionStateService,
  ) {
  }

  ngOnInit(): void {
    this.customerName = this.config.getEnvironment()?.customerName ?? '';
    this.helpPanel = this.config.getEnvironment()?.helpPanel;
    this.user$ = this.userService.getUser$();

    this.activeUrl$ = this.routerState.getUrl$();

    this.menus$ = this.state.getScopes$().pipe(
      map(scope => {
        return this.menus
          .filter(item => scope.some(j => !item.canActivate
            || j.includes(`${RightEnum.READ}_all`) || j.includes(`${RightEnum.READ}_${item.url}`)),
          );
      }),
    );

    this.apiVersion$ = this.versionStateService.getVersion();
    this.appVersion = this.config.getAppVersion();

    this.theme$ = this.userService.getUserTheme$();
    this.status$ = this.userService.getStatus$();
  }

  logOut(): void {
    this.authService.logout(false);
  }

  onToggleTheme(event: boolean, userId: number | undefined): void {
    if(userId){
      this.themeService.toggleTheme(userId, event);
    }
  }

  updatePage(value: string | null): void {
    if (!value) {
      this.state.clean();
    } else {
      this.state.boot();
    }
  }
}
