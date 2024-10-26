import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, filter, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000),
      ]),
      transition('* => void', [
        animate(2000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AuthContainerComponent implements OnInit, OnDestroy {
  customerName = '';
  logoFormat = '';
  customerUrl = '';
  activeLang = '';
  loginPageSlider = false;
  loginPageBackgroundFormat = 'png';

  private _index: Subject<number> = new BehaviorSubject(this.randomNumber());
  index$: Observable<number> = this._index.asObservable();

  private destroy$ = new Subject<void>();

  constructor(
    private translocoService: TranslocoService,
    private config: ConfigService,
  ) {
  }

  ngOnInit(): void {
    this.customerName = this.config.getEnvironment()?.customerName ?? '';
    this.logoFormat = this.config.getEnvironment()?.logoFormat ?? 'png';
    this.customerUrl = this.config.getEnvironment()?.customerUrl ?? '';
    this.loginPageSlider = this.config.getEnvironment()?.loginPageSlider ?? false;
    this.loginPageBackgroundFormat = this.config.getEnvironment()?.loginPageBackgroundFormat ?? 'png';
    this.activeLang = this.translocoService.getActiveLang();

    if(this.loginPageSlider) {
      this.index$
        .pipe(
          takeUntil(this.destroy$),
          filter(i => !!i),
        )
        .subscribe(() => {
          setTimeout(() => {
            this._index.next(0);
          }, 6000);

          setTimeout(() => {
            this._index.next(this.randomNumber());
          }, 6000);
        });
    }
  }

  randomNumber(): number {
    const n = Math.floor( Math.random() * 6 );

    return n || 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onChangeLanguage($event: string): void {
    this.translocoService.setActiveLang($event);
    this.activeLang = this.translocoService.getActiveLang();
  }
}
