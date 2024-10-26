import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterStateService, UiStateService } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'concordia-nx-ionic-hierarchies-panel',
  templateUrl: './hierarchies-panel.component.html',
  styleUrls: ['./hierarchies-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesPanelComponent implements OnInit {
  _filters!: any;
  @Input() set filters(f: any) {
    this._filters = f;

    this.setSelectedHierarchies(f?.hierarchyId ?? null);
  }

  get filters(): any {
    return this._filters;
  }

  id$!: Observable<string | null>;
  items$!: Observable<any>;
  loading$!: Observable<boolean>;

  constructor(
    private readonly hierarchiesStateService: HierarchiesStateService,
    private readonly uiStateService: UiStateService,
    private readonly routerStateService: RouterStateService,
  ) {
  }

  ngOnInit(): void {
    this.id$ = this.hierarchiesStateService.getSelectedHierarchies();

    this.items$ = this.id$.pipe(
      switchMap((id) => this.hierarchiesStateService.getHierarchiesIdList(id)),
    );

    this.loading$ = this.hierarchiesStateService.getHierarchiesIdListLoading();
  }

  onSetSelectedHierarchies(hierarchyId: string): void {
    this.hierarchiesStateService.setSelectedHierarchies(hierarchyId);

    if(hierarchyId) {
      this.hierarchiesStateService.loadHierarchiesIdList(hierarchyId);
    } else {
      this.routerStateService.navigate([], undefined, {
        queryParamsHandling: 'merge',
        queryParams: {
          filter: JSON.stringify({
            ...this.filters,
            // meterId: null,
            hierarchyId: null,
            nodeId: null,
            meterIds: null,
          }),
        },
      });
    }
  }

  setSelectedHierarchies(hierarchyId: string | null): void {
    this.hierarchiesStateService.setSelectedHierarchies(hierarchyId);

    if(hierarchyId) {
      this.hierarchiesStateService.loadHierarchiesIdList(hierarchyId);
    }
  }

  toggleRightPanel(): void {
    this.uiStateService.toggleRightPanel();
  }
}
