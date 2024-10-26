import { MultiActionEnum } from '../../enum';

export interface MultiAction {
  icon?: string;
  name: string;
  type: MultiActionEnum;
  fn?: (...args: any[]) => any;
}
