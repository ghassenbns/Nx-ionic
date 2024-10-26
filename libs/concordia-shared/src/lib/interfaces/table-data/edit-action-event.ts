import { EditActionEnum } from '../../enum/edit-action-enum';

export interface EditActionEvent {
  rows?: any[],
  type: EditActionEnum;
}
