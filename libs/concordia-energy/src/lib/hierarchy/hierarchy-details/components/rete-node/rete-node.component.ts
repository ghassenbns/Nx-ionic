import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges } from '@angular/core';
import { ClassicPreset as Classic } from 'rete';

type SortValue<N extends Classic.Node> = (N['controls'] | N['inputs']  | N['outputs'])[string]

@Component({
  templateUrl: './rete-node.component.html',
  styleUrls: ['./rete-node.component.scss'],
})
export class ReteNodeComponent implements OnChanges {
  @Input() data!: Classic.Node;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;

  @HostBinding('class.selected') get selected(): any {
    const d: any = this.data;
    return d?.editable ? this.data?.selected : false;
  }

  constructor(private cdr: ChangeDetectorRef)  {
    this.cdr.detach();
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
    this.seed++; // force render sockets
  }

  sortByIndex<N extends Classic.Node, I extends KeyValue<string, SortValue<N>>>(a: I, b: I): number {
    const ai = a.value?.index || 0;
    const bi = b.value?.index || 0;

    return ai - bi;
  }
}
