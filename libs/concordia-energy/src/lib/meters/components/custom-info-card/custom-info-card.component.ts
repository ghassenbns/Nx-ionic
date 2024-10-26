import { Component, Input } from '@angular/core';
import { MeterInterface } from '@concordia-nx-ionic/concordia-energy-api';

@Component({
  selector: 'concordia-nx-ionic-meter-custom-info-card',
  templateUrl: './custom-info-card.component.html',
  styleUrls: ['./custom-info-card.component.scss'],
})
export class MeterCustomInfoCardComponent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEditModal($event: boolean, arg1: any): void {
    throw new Error('Method not implemented.');
  }

  @Input() meter: MeterInterface | any = {};
  @Input() isLoading: boolean | null = false;

}
