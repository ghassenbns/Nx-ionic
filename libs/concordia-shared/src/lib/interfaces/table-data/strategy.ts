import { Action } from './action';
import { Column } from './column';
import { MultiAction } from './multi-action';

export interface Strategy {
  name: string;
  entity: string;
  link?: {
    field: string;
    pref: string;
    sfx: string;
  }
  column?: number;
  columns: Column[];
  actions: Readonly<Action[]>;
  multiActions: Readonly<MultiAction[]>;
  editActions?: Readonly<Action[]>;
}
