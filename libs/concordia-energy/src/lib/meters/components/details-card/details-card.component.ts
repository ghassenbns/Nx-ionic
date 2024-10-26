import { Component, Input, OnInit } from '@angular/core';
import { MeterInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { BooleanState, CardConfigInterface } from '@concordia-nx-ionic/concordia-shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-meter-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss'],
})
export class MeterDetailsCardComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEditModal($event: boolean, arg1: any) :void {
    throw new Error('Method not implemented.');
  }

  @Input() meter: MeterInterface | any = {};
  @Input() isLoading : boolean | null = false;
  editMode!: BehaviorSubject<BooleanState>;
  cardConfig!: CardConfigInterface;

  ngOnInit(): void {
    this.cardConfig = {
      selector: 'details',
      title: 'details',
      editable: { state: this.meter.isOwned, mode: 'modal' },
    };
  }
}
