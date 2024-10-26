import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feature, reOrder } from '@concordia-nx-ionic/concordia-mobility-api';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'concordia-nx-ionic-features-edit',
  templateUrl: './features-edit.component.html',
  styleUrls: ['./features-edit.component.scss'],
})
export class FeaturesEditComponent {
  @Input() features!: Feature[];
  @Input() editMode = false;
  @Output() delete = new EventEmitter<Feature>();
  @Output() add = new EventEmitter<any>();
  @Output() reorder = new EventEmitter<reOrder>();
  @Output() active = new EventEmitter<string>();
  @ViewChild(NgForm) form!: NgForm;

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>): void {
    ev.detail.complete();

    this.reorder.emit({ from: ev.detail.from, to: ev.detail.to });
  }

  onAdd(event: Event): void {
    this.add.emit(event);
  }

  onDelete(feature: Feature): void {
    this.delete.emit(feature);
  }

  onClick(id: string): void {
    this.active.emit(id);
  }
}
