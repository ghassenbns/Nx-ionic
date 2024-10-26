import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'concordia-nx-ionic-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ResetComponent implements OnInit {
  form!: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // eslint-disable-next-line no-console
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
