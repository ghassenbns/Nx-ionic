import { Component, ElementRef, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import {
  UsersApiService,
  UsersRelationshipsApiService,
  UsersRelationshipsInterface,
} from '@concordia-nx-ionic/concordia-api';
import { RouterStateService, UiStateService, UserLevelEnum } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesApiService, HierarchiesInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { AlertService, PartialWithRequiredKey } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AngularArea2D, AngularPlugin, Presets } from 'rete-angular-plugin/16';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
  AutoArrangePlugin, Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import { MinimapPlugin } from 'rete-minimap-plugin';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  finalize,
  first,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { DeleteButtonComponent, DeleteButtonControl } from './components/rete-delete-button';
import { ReteInputComponent, ReteInputControl } from './components/rete-input';
import { ReteMultiSelectComponent, ReteMultiSelectControl } from './components/rete-multi-select';
import { ReteNodeComponent } from './components/rete-node/rete-node.component';
import { ReteSelectComponent, ReteSelectControl } from './components/rete-select';
import { ReteToggleComponent, ReteToggleControl } from './components/rete-toggle';

class Node extends ClassicPreset.Node {
  editable = true;
  width = 300;
  height = 550;
}

class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {
}

type Schemes = GetSchemes<Node, Connection<Node>>;

type AreaExtra = AngularArea2D<Schemes>;

@Component({
  selector: 'concordia-nx-ionic-hierarchy-details',
  templateUrl: './hierarchy-details.component.html',
  styleUrls: ['./hierarchy-details.component.scss'],
})
export class HierarchyDetailsComponent implements OnInit {
  @ViewChild('rete') container!: ElementRef;
  @ViewChild('fullScreen') fullScreenElement!: any;
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullScreenModes(): void{
    this.chkScreenMode();
  }

  id$!: Observable<string>;
  item!: HierarchiesInterface | null;

  socket = new ClassicPreset.Socket('socket');
  editor = new NodeEditor<Schemes>();
  arrange = new AutoArrangePlugin<Schemes>();

  ownersItems: UsersRelationshipsInterface[] = [];
  usersRelationships: UsersRelationshipsInterface[] = [];
  meters: any[] = [];
  metersList$!: Observable<any[]>;

  isFullScreen = false;
  first = true;
  firstZoom = 1000;

  private _loading: Subject<boolean> = new BehaviorSubject(false);
  loading$: Observable<boolean> = this._loading.asObservable();

  private _ownerId: Subject<number> = new Subject();
  ownerId$: Observable<number> = this._ownerId.asObservable();

  private showConfirmationDelete = true;
  private showConfirmationIsLeaf = true;
  private area: any;

  private newItem = {
    name: '',
    description: '',
    isPublic: false,
    isLeaf: false,
    meterIds: [],
  };

  labels = {
    name: '',
    description: '',
    public: '',
    leaf: '',
    owner: '',
    viewers: '',
    meters: '',
  };

  errorMessageNoСonnection = '';
  errorMessageInvalidForm = '';

  constructor(
    private readonly injector: Injector,
    private readonly routerStateService: RouterStateService,
    private readonly hierarchiesApiService: HierarchiesApiService,
    private readonly usersApiService: UsersApiService,
    private readonly usersRelationshipsApiService: UsersRelationshipsApiService,
    private readonly meterStateService: MetersStateService,
    private readonly translocoService: TranslocoService,
    private readonly notificationService: UINotificationStateService,
    private readonly alertService: AlertService,
    private readonly uiStateService: UiStateService,
  ) {
  }

  ngOnInit(): void {
    this.fullScreenElement = document.documentElement;

    Object.keys(this.labels).forEach((key: string) => {
      this.translateLabels(key);
    });

    this.translocoService.selectTranslate(`errors.noСonnection`)
      .pipe(
        first(),
      )
      .subscribe(value => {
        this.errorMessageNoСonnection = value;
      });

    this.translocoService.selectTranslate(`errors.invalidForm`)
      .pipe(
        first(),
      )
      .subscribe(value => {
        this.errorMessageInvalidForm = value;
      });

    this.id$ = this.routerStateService.getParam$('id')?.pipe(
      filter(id => !!id),
      distinctUntilChanged(),
      first(),
      tap(id => {
        this._loading.next(true);

        this.hierarchiesApiService.show(id)
          .pipe(
            first(),
            finalize(() => {
              setTimeout(() => {
                this._loading.next(false);
                this.first = false;
              }, this.firstZoom);
            }),
          )
          .subscribe(
            (i: any) => {
              this.item = i;

              if(this.item?.ownerId && this.item.isEditable){
                this.getUsersRelationships(this.item.ownerId);
                this.meterStateService.loadMeterList({ viewAsUserId: this.item.ownerId });
              }

              this.init(this.item);
            },
          );
      }),
    );

    this.metersList$ = this.meterStateService.getMeterList();

    combineLatest([
      this.metersList$,
      this.ownerId$,
    ])
      .subscribe(([list, id]) => {
        this.meters = (id in list) ? [...list[id]] : [];

        if (this.item?.isEditable && id in list) {
          this.editor['nodes']
            .forEach((node: any) => {
              const control = node.controls['meterIds'];

              if (control) {
                control.setItems(this.meters);
              }

              if (control.value) {
                const existsMeters = control.value.filter((value: any) => this.meters.find(m => m._id === value));

                if (control.value.length !== existsMeters.length) {
                  control.setValue(existsMeters || []);
                }
              }
            });
        }
      });

    this.loadOwnersItems();
  }

  init(items: any): void {
    const el = this.container.nativeElement;

    if (el) {
      this.createEditor(el, this.injector, items).then();
    }

    setTimeout(() => this.onCancel(), this.firstZoom);
  }

  async createEditor(container: HTMLElement, injector: Injector, items: any): Promise<any> {
    this.area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new AngularPlugin<Schemes, AreaExtra>({ injector });

    AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    const minimap = new MinimapPlugin<Schemes>({
      boundViewport: true,
    });

    render.addPreset(
      Presets.classic.setup({
        customize: {
          node() {
            return ReteNodeComponent;
          },
          control(data) {
            if (data.payload instanceof ReteInputControl) {
              return ReteInputComponent;
            }
            if (data.payload instanceof ReteSelectControl) {
              return ReteSelectComponent;
            }
            if (data.payload instanceof ReteMultiSelectControl) {
              return ReteMultiSelectComponent;
            }
            if (data.payload instanceof ReteToggleControl) {
              return ReteToggleComponent;
            }
            if (data.payload instanceof DeleteButtonControl) {
              return DeleteButtonComponent;
            }
            return null;
          },
        },
      }),
    );

    render.addPreset(Presets.minimap.setup({ size: 200 }) as any);

    connection.addPreset(ConnectionPresets.classic.setup());
    this.arrange.addPreset(ArrangePresets.classic.setup());

    this.editor.use(this.area);

    if(this.item?.isEditable) {
      this.area.use(connection);
    }

    this.area.use(render);

    this.area.use(this.arrange);
    this.area.use(minimap);

    AreaExtensions.simpleNodesOrder(this.area);
    this._ownerId.next(items.ownerId);

    await this.createNodes(this.area, items).then(() => {
      this.zoom();
    });

    return () => this.area.destroy();
  }

  async createNodes(area: any, items: any, child = false, b: any = null): Promise<void> {
    await this.createNode(area, items, child, b).then((t: any) => {
      if (items?.children?.length) {
        items?.children.map((i: any) => this.createNodes(area, i, true, t));
      }
    });
  }

  async createNode(area: any, items: any, child: boolean, b: any): Promise<any> {
    const id = items._id;

    const a = new Node('');

    a.editable = this.item?.isEditable ?? true;

    if (items._id) {
      a.addControl(
        '_id',
        new ClassicPreset.InputControl('text', { initial: id }),
      );
    } else {
      a.addControl(
        'uuid',
        new ClassicPreset.InputControl('text', { initial: uuidv4() }),
      );
    }

    a.addControl(
      'name',
      new ReteInputControl(this.labels.name, items.name, !this.item?.isEditable, () => ({}), true),
    );

    a.addControl(
      'description',
      new ReteInputControl(this.labels.description, items.description, !this.item?.isEditable, () => ({})),
    );

    a.addControl(
      'isPublic',
      new ReteToggleControl(this.labels.public, items.isPublic, !this.item?.isEditable, () => {
        const node = this.editor['nodes'].find((n: any) => n.id === a.id);

        if (node) {
          const control = node.controls['isPublic'];
          control.toggleValue();
        }
      }),
    );

    a.addControl(
      'isLeaf',
      new ReteToggleControl(this.labels.leaf, items.isLeaf, !child || !this.item?.isEditable, () => {
        const control: any = a.controls['name'];

        if(this.showConfirmationIsLeaf) {
          this.presentAlert(control.value, a.id, 'isLeaf');
        } else {
          this.setIsLeaf(a.id);
        }
      }),
    );

    if (!child) {
      if(this.item?.isEditable) {

        a.addControl(
          'ownerId',
          new ReteSelectControl(this.labels.owner, items.ownerId, this.ownersItems, (value: any) => {
            const node = this.editor['nodes'].find((n: any) => n.id === a.id);

            if (node) {
              const control = node.controls['viewerIds'];
              control.setValue([]);
            }

            this.getUsersRelationships(value);
            this._ownerId.next(value);
            this.meterStateService.loadMeterList({ viewAsUserId: value });
          }),
        );
      } else {
        a.addControl(
          'ownerId',
          new ReteInputControl(this.labels.owner, items.owner.name, !this.item?.isEditable, () => ({})),
        );
      }

      if(this.item?.isEditable) {
        a.addControl(
          'viewerIds',
          new ReteMultiSelectControl({ label: this.labels.viewers,
              optionsField: 'name',
              optionsValue: 'relationUserId' },
            items.viewerIds, this.usersRelationships, () => ({})),
        );
      } else {
        a.addControl(
          'viewerIds',
          new ReteInputControl(this.labels.viewers,
            items.viewers.map((v: any) => v.name ),
            !this.item?.isEditable, () => ({})),
        );
      }

    }

    if(this.item?.isEditable) {
      a.addControl(
        'meterIds',
        new ReteMultiSelectControl({
            label: this.labels.meters,
            optionsField: 'name',
            optionsValue: '_id',
            disabled: !items.isLeaf,
          },
          items.meterIds, this.meters, () => ({})),
      );
    } else {
      a.addControl(
        'meterIds',
        new ReteInputControl(this.labels.meters,
          items.meters?.map((v: any) => v.name ),
          !this.item?.isEditable, () => ({})),
      );
    }

    if (child && this.item?.isEditable) {
      a.addControl(
        'button',
        new DeleteButtonControl('Delete', () => {
          const control: any = a.controls['name'];

          if(this.showConfirmationDelete) {
            this.presentAlert(control.value, a.id, 'delete');
          } else {
            this.delete(a.id);
          }
        }),
      );
    }

    if (!items.isLeaf) {
      a.addOutput(a.id, new ClassicPreset.Output(this.socket));
    }

    if (child) {
      a.addInput(a.id, new ClassicPreset.Input(this.socket));
    }

    await this.editor.addNode(a);

    if (b) {
      await this.editor.addConnection(new Connection(b.a, b.id, a, a.id));
    }

    return { a: a, id: a.id };
  }

  delete(id: any): void {
    const connections = this.editor.getConnections().filter(c => c.target === id || c.source === id);
    this.removeConnections(connections);

    this.editor.removeNode(id).then();
  }

  setIsLeaf(id: string): void {
    const node = this.editor['nodes'].find((n: any) => n.id === id);

    if (node) {
      const control = node.controls['isLeaf'];
      control.toggleValue();

      if (control.value) {
        const connections = this.editor.getConnections().filter(c => c.source === id);
        this.removeConnections(connections);

        Object.keys(node.outputs).forEach(key => {
          node.removeOutput(key);
        });
      } else {
        node.addOutput(id, new ClassicPreset.Output(this.socket));
      }

      const controlMeter = node.controls['meterIds'];
      controlMeter.setDisabled(!control.value);
      controlMeter.setValue([]);

      this.area.update('node', id);
    }
  }

  async presentAlert(names: string, id: string, type: 'delete' | 'isLeaf'): Promise<void> {
    await this.alertService.show(
      {
        header: 'global.warning',
        message: type === 'delete' ? 'errors.recordDeleteConfirmation' : 'errors.recordIsLeafConfirmation',
        buttons: [
          {
            text: 'global.cancel',
            role: 'cancel',
          },
          {
            text: 'global.ok',
            role: 'confirm',
            handler: (rez: any) => {
              if(type === 'delete') {
                this.delete(id);

                if(rez && rez[0]){
                  this.showConfirmationDelete = !rez[0];
                }
              }

              if(type === 'isLeaf') {
                this.setIsLeaf(id);

                if(rez && rez[0]){
                  this.showConfirmationIsLeaf = !rez[0];
                }
              }
            },
          },
        ],
      },
      true,
      { message: { count: 1, records: names } },
      type === 'delete' ? this.showConfirmationDelete : this.showConfirmationIsLeaf,
    );
  }

  onCancel(): void {
    this.editor.clear().then(() => {
      this.createNodes(this.area, this.item).then(() => this.zoom());
    });
  }

  async onAdd(): Promise<void> {
    await this.createNode(this.area, this.newItem, true, 0);

    this.zoom();
  }

  onSave(): void {
    const errorMessage = this.errorMessage();

    if(errorMessage){
      this.notificationService.error(errorMessage);
    } else {
      const nodes = this.editor.getNodes().find(key => !Object?.keys(key.inputs).length);

      this.edit({
        ...this.getValue(nodes, this.editor.getNodes(), this.editor.getConnections()),
      });
    }
  }

  getValue(array: any, nodes: any, connections: any): any {
    const children = Object.keys(array.outputs).map(k => {
      const childrenNodes = nodes.filter((n: any) => {
        const connection = connections.filter((c: any) => c.sourceOutput === k);
        return connection && connection.find((f: any) => f.target === n.id);
      });

      return childrenNodes?.length ? childrenNodes.map((i: any) => this.getValue(i, nodes, connections)) : null;
    }).filter(i => !!i)[0];

    return {
      ...Object.keys(array.controls).reduce((acc: any, key: any) => {
        acc[key] = array.controls[key].value;
        return acc;
      }, {}),
      children: children?.length ? [...children] : [],
    };
  }

  edit(event: PartialWithRequiredKey<HierarchiesInterface, '_id'>): void {
    this._loading.next(true);

    this.hierarchiesApiService.update(
      {
        ...event,
        viewerIds: event?.viewerIds ? event?.viewerIds : [],
      },
    ).pipe(
      first(),
      finalize(() => {
        this._loading.next(false);
      }),
    ).subscribe((i) => {
        this.item = i.data;
        this.onCancel();
      },
    );
  }

  onFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => this.zoom());
    } else {
      document.documentElement.requestFullscreen().then(() => this.zoom());
    }
  }

  private zoom(): void {
    setTimeout(() => {
      this.arrange.layout(
        {
          options: {
            'elk.algorithm': 'mrtree', // 'layered' 'mrtree' 'stress'
            'elk.direction': 'RIGHT',
            'elk.alignment': 'RIGHT',
            'elk.layered.spacing.nodeNodeBetweenLayers': '200',
            'elk.mrtree.weighting': 'CONSTRAINT',
            'elk.spacing.edgeNode': '0',
            'elk.spacing.nodeNode': '200',
          },
        },
      ).then(() => {
        AreaExtensions.zoomAt(this.area, this.editor.getNodes()).then();
      });
    }, 0);
  }

  loadOwnersItems(): void {
    const params = {
      filter: JSON.stringify([
        {
          scope: 'user_level_id',
          operator: '<=',
          value: UserLevelEnum.LEVEL_ID_OPERATOR,
          type: 'int',
        },
      ]),
    };

    this.usersApiService.list({ params })
      .pipe(
        first(),
      )
      .subscribe(res => {
        this.ownersItems = res.data;

        const node = this.editor['nodes'].find((n: any) => n.controls.ownerId);

        if (node && this.item?.isEditable) {
          const control = node.controls['ownerId'];
          control.setItems(this.ownersItems);
        }
      });
  }

  getUsersRelationships(id: string): void {
    this.usersRelationshipsApiService.list({ params: { user_id: id } })
      .pipe(
        first(),
      )
      .subscribe(res => {

        this.usersRelationships = res.data.map((d: UsersRelationshipsInterface) => ({
          ...d,
          name: d.relatedUser.name,
        }));

        const node = this.editor['nodes'].find((n: any) => n.controls.viewerIds);

        if (node) {
          const control = node.controls['viewerIds'];
          control.setItems(this.usersRelationships);
        }
      });
  }

  private translateLabels(key: string): void {
    this.translocoService.selectTranslate(`table.${key}`)
      .subscribe(value => {
        this.labels = {
          ...this.labels,
          [key]: value,
        };
      });
  }

  private errorMessage(): string {
    let message = '';
    const nodes = this.editor['nodes'];

    nodes
      .filter((n: any) => !(n.controls['name'] && n.controls['name'].value))
      .map((node: any) => {
        message = this.errorMessageInvalidForm;

        const control = node.controls['name'];
        control?.setTouched();
      });

    if((nodes.length - 1) !== this.editor.getConnections().length) {
      message = `${this.errorMessageNoСonnection} ${message}`;
    }

    return message;
  }

  private removeConnections(connections: Connection<Node>[]): void {
    if(connections.length) {
      this.editor.removeConnection(connections[connections.length - 1].id).then(() => {
        connections.pop();
        this.removeConnections(connections);
      });
    }
  }

  private chkScreenMode(): void {
    if(document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }

    this.uiStateService.togglePageElements();
    this.zoom();
  }
}
