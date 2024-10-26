import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  pending$!: Observable<boolean>;
  displayDensity$!: Observable<string>;

  constructor(
    private readonly loader: LoadingBarService,
    private readonly state: AppStateService,
    private readonly userService: UserStateService,
  ) {
  }

  ngOnInit(): void {
    this.state.boot();
    this.displayDensity$ = this.userService.getDisplayDensity$();

    this.pending$ = this.loader.value$.pipe(
      map(v => !!v),
      distinctUntilChanged(),
      debounceTime(100),
    );
  }
}
