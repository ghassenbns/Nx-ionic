import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HierarchiesStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { Observable } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-hierarchies-filters',
  templateUrl: './hierarchies-filters.component.html',
  styleUrls: ['./hierarchies-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesFiltersComponent implements OnInit {
  @Input() loading = false;
  @Input() filters: any;
  @Input() item!: any;
  @Output() submitted = new EventEmitter<any>();
  @ViewChild(NgForm) form!: NgForm;

  showFilters = true;
  list$!: Observable<any[]>;

  constructor(
    private readonly hierarchiesStateService: HierarchiesStateService,
  ) {
  }

  ngOnInit(): void {
    this.hierarchiesStateService.loadHierarchiesList();
    this.list$ = this.hierarchiesStateService.getHierarchiesList();
  }

  onShowFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onEnterApplyFilter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onApplyFilter();
    }
  }

  onApplyFilter(): void {
    this.submitted.emit(this.form.value);
    this.form.form.markAsPristine({ onlySelf: true });
  }

  disabledReset(): boolean {
    if(this.form?.value) {
      return !this.form.value.hierarchyId;
    }

    return false;
  }
}
