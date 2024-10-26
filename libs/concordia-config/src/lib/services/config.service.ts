import { Inject, Injectable } from '@angular/core';

import { ENVIRONMENT, VERSION } from '../tokens';

@Injectable()
export class ConfigService {

  constructor(@Inject(ENVIRONMENT) private environment: any, @Inject(VERSION) private version: string) {
  }

  getEnvironment(): any {
    return { ...this.environment };
  }

  getOrsToken(): string {
    return this.environment.orsToken;
  }

  getMapStyle(theme: string | null = null): string {
    return theme === 'dark' ? this.environment.mapDarkStyle : this.environment.mapStyle;
  }

  getMapDarkStyle(): string {
    return this.environment.mapDarkStyle;
  }

  getMapStyles(theme: string | null = null): string[] {
    return theme === 'dark' ? [this.environment.mapDarkStyle, this.environment.mapStyle] :
      [this.environment.mapStyle, this.environment.mapDarkStyle];
  }

  getAppVersion(): string {
    return this.version || '';
  }
}
