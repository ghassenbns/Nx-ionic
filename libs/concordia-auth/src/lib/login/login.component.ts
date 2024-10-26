import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService, Status } from '@concordia-nx-ionic/concordia-core';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import { first, Observable } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form!: UntypedFormGroup;
  status$!: Observable<Status>;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private readonly notificationService: UINotificationStateService,
    private readonly translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.status$ = this.authService.getStatus$();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.translocoService
        .selectTranslate(`errors.invalidForm`)
        .pipe(first())
        .subscribe(errorMessage => {
          this.notificationService.error(errorMessage);
        });
    }
  }
}
