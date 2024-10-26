import { Component, Input, OnInit } from '@angular/core';
import { RouterStateService } from '@concordia-nx-ionic/concordia-core';

interface Column {
  field: string;
  header: string;
  type: string;
}

interface NodeEvent {
  originalEvent: Event;
  node: any;
}

@Component({
  selector: 'concordia-nx-ionic-hierarchies-tree',
  templateUrl: './hierarchies-tree.component.html',
  styleUrls: ['./hierarchies-tree.component.scss'],
})
export class HierarchiesTreeComponent implements OnInit {
  @Input() loading = false;
  @Input() filters: any;
  @Input() hierarchyId: string | null = null;

  _items!: any;
  @Input() set items(d: any) {
    if(d){

      if(this.filters?.nodeId && this.filters?.hierarchyId === this.hierarchyId) {
        this.setSelected([d], this.filters.nodeId);
        this._items = JSON.parse(JSON.stringify(this.setExpanded([d], this.ooo)));
      } else {
        this._items = JSON.parse(JSON.stringify([d]));
        this.selectedNode = null;
      }

    } else {
      this._items = [];
      this.selectedNode = null;
    }
  }

  get items(): any {
    return this._items;
  }

  cols!: Column[];
  ooo: string[] = [];
  selectedNode!: any;

  constructor(
    private readonly routerStateService: RouterStateService,
  ) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Name', type: 'string' },
      // { field: 'isPublic', header: 'isPublic', type: 'icon' },
    ];
  }

  nodeSelect(event: NodeEvent): void {
    this.routerStateService.navigate([], undefined, {
      queryParamsHandling: 'merge',
      queryParams: {
        filter: JSON.stringify({
          ...this.filters,
          hierarchyId: this.hierarchyId,
          nodeId: event.node.data._id,
          meterIds: event.node.data.meterIds,
        }),
      },
    });
  }

  nodeUnselect(): void {
    this.routerStateService.navigate([], undefined, {
      queryParamsHandling: 'merge',
      queryParams: {
        filter: JSON.stringify({
          ...this.filters,
          hierarchyId: this.hierarchyId,
          nodeId: null,
          meterIds: null,
        }),
      },
    });
  }

  private setSelected(items: any[], nodeId: string, array: string[] = []): void {
    const selectedItem = items?.find((i: any) => i.data?._id === nodeId);

    if(selectedItem) {
      this.selectedNode = selectedItem;
      this.ooo = [...array];
    } else {
      items.forEach((i: any) => {
        this.setSelected(i.children, nodeId, [...array, i.data._id]);
      });
    }
  }

  private setExpanded(items: any[], array: string[] = []): any[] {
    return items.map(i => array.length && i.data._id === array[0]
      ? {
        ...i,
        children: this.setExpanded(i.children, array.filter((_, n: number) => n > 0)),
        expanded: true,
      } : i);
  }
}
