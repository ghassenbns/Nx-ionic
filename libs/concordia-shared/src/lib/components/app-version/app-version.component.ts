import { Component, Input } from '@angular/core';
@Component({
  selector: 'concordia-ng-shared-app-version',
  templateUrl: './app-version.component.html',
  styleUrls: ['./app-version.component.scss'],
})
export class AppVersionComponent {
  @Input() versionNumber!: string;
  @Input() versionPrefix!: string;
}
