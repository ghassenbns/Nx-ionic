import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConcordiaEnergyStoreModule } from '@concordia-nx-ionic/concordia-energy-store';
import { SharedModule } from '@concordia-nx-ionic/concordia-shared';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ReteModule } from 'rete-angular-plugin/16';

import { HierarchiesFiltersComponent } from './components/hierarchies-filters/hierarchies-filters.component';
import { HierarchiesTableComponent } from './components/hierarchies-table/hierarchies-table.component';
import { HierarchiesTreeComponent } from './components/hierarchies-tree/hierarchies-tree.component';
import { ModalEditHierarchyComponent } from './components/modal-edit-hierarchy/modal-edit-hierarchy.component';
import { HierarchiesPanelComponent } from './hierarchies-panel/hierarchies-panel.component';
import { DeleteButtonComponent } from './hierarchy-details/components/rete-delete-button';
import { ReteInputComponent } from './hierarchy-details/components/rete-input';
import { ReteMultiSelectComponent } from './hierarchy-details/components/rete-multi-select';
import { ReteNodeComponent } from './hierarchy-details/components/rete-node/rete-node.component';
import { ReteSelectComponent } from './hierarchy-details/components/rete-select';
import { ReteToggleComponent } from './hierarchy-details/components/rete-toggle';
import { HierarchyDetailsComponent } from './hierarchy-details/hierarchy-details.component';
import { HierarchyListComponent } from './hierarchy-list/hierarchy-list.component';

@NgModule({
  declarations: [
    HierarchyListComponent,
    HierarchyDetailsComponent,
    HierarchiesPanelComponent,
    HierarchiesFiltersComponent,
    HierarchiesTreeComponent,
    HierarchiesTableComponent,
    ModalEditHierarchyComponent,
    ReteInputComponent,
    ReteToggleComponent,
    DeleteButtonComponent,
    ReteSelectComponent,
    ReteMultiSelectComponent,
    ReteNodeComponent,
  ],
  imports: [
    CommonModule,
    TreeTableModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    TranslocoModule,
    SkeletonModule,
    TableModule,
    ReteModule,
    ConcordiaEnergyStoreModule,
  ],
  exports: [HierarchiesPanelComponent],
})
export class HierarchyModule {}
