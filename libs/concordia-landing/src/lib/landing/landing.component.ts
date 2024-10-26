import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  theme$!: Observable<string>;
  customerName!: string;

  constructor(
    private config: ConfigService,
    private readonly userService: UserStateService,
  ) {
  }

  ngOnInit(): void {
    this.theme$ = this.userService.getUserTheme$();
    this.customerName = this.config.getEnvironment()?.customerName;
  }

  getUrl(theme = 'light'): string {
    return `${this.customerName}_${theme}_landing.${this.config.getEnvironment()?.landingLogoFormat || 'png'}`;
  }
}
