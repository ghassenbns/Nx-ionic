import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { SelectOption } from '../../interfaces';

export interface ModalData {
  data: SelectOption[];
  group: string;
}

export interface Items {
  [key: string | number]: any[];
}

@Component({
  selector: 'concordia-ng-shared-search-select-popover',
  templateUrl: './search-select-popover.component.html',
  styleUrls: ['./search-select-popover.component.scss'],
})
export class SearchSelectPopoverComponent implements OnInit {
  options: SelectOption[] = [];
  groupOptions: Items = {};
  search = '';
  groupField = '';
  field = 'name';

  constructor(
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
  ) {
  }

  ngOnInit(): void {
    const navParamsData = this.navParams.data as ModalData;

    if(navParamsData) {
      this.options = navParamsData.data;
      this.groupField = navParamsData.group;

      if(this.groupField) {
        this.options.forEach(user => {
          const groupLevel = user[this.groupField];

          if (groupLevel) {
            if (!this.groupOptions[groupLevel]) {
              this.groupOptions[groupLevel] = [];
            }
            this.groupOptions[groupLevel].push(user);
          }
        });
      }
    }
  }

  onSelectOption(option: any): void {
    this.cancel(option).then();
  }

  cancel(data: unknown = null): Promise<boolean> {
    return this.popoverCtrl.dismiss(data, 'cancel');
  }

  showItemTitle(value: string, search: string): boolean {
    return !search || value.toLowerCase().includes(search.toLowerCase());
  }

  showGroupTitle(value: SelectOption[], search: string): boolean {
    return !search || value.some(j => j[this.field]?.toString().toLowerCase().includes(search.toLowerCase()));
  }

  noData(options: SelectOption[], search: string): boolean {
    return !options.some(
      (i: SelectOption) =>
        typeof i[this.field] === 'string' &&
        i[this.field].toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );
  }
}
