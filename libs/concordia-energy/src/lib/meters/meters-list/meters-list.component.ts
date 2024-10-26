import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'concordia-nx-ionic-meters-list',
  templateUrl: './meters-list.component.html',
  styleUrls: ['./meters-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetersListComponent {
  constructor(
    // private readonly metersApiService: MetersApiService,
    ) {

    // this.metersApiService.list()
    //   // eslint-disable-next-line no-console
    //   .subscribe((i: any) => console.error('i', i));
  }
}
