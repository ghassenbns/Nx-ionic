import { MultiActionEnum } from '../../enum';

export interface MultiActionEvent {
  rows: any[],
  type: MultiActionEnum;
}
