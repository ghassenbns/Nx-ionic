import { ButtonEnum } from '../../enum';
import { ActionEnum } from '../../enum/action-enum';

export interface Action {
  type: ActionEnum;
  actionType?: ButtonEnum;
  link?: {
    field: string;
    pref: string;
    sfx: string;
  };
  fn?: (...args: any[]) => any;
}
