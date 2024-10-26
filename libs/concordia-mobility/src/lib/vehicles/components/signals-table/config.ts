import {
  ActionEnum,
  MultiActionEnum,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';

export const signalsDataConfig: Strategy = {
  name: 'signals',
  entity: 'signal',
  columns: [
    {
      field: 'type',
      contentType: 'string',
      rowSelector: 'vehicleSignalTypeLabel',
      rowEditSelector: 'vehicleSignalTypeId',
      required: true,
      searchType: 'select',
      editType: 'selectSearch',
      filterType: 'string',
      optionsValue: 'vehicleSignalTypeId',
      optionsField: 'label',
      options: [],
      validators: ['noRepeat'],
    },
    {
      field: 'node',
      contentType: 'string',
      rowSelector: 'nodeName',
      rowEditSelector: 'nodeId',
      required: true,
      searchType: 'select',
      editType: 'selectSearch',
      filterType: 'string',
      options: [],
    },
    {
      field: 'compSignal',
      contentType: 'string',
      rowSelector: 'compSignalName',
      rowEditSelector: 'compSignalId',
      required: true,
      searchType: 'text',
      editType: 'selectSearch',
      filterType: 'string',
      optionsValue: 'compSignalId',
      optionsFilter: ['nodeId'],
      options: [],
      validators: ['noRepeat'],
    },
    {
      field: 'alias',
      contentType: 'string',
      rowSelector: 'alias',
      required: true,
      searchType: 'text',
      filterType: 'string',
      options: [],
    },
  ],
  actions: [
    { type: ActionEnum.INFO },
    { type: ActionEnum.EDIT },
    { type: ActionEnum.DELETE },
  ],
  multiActions: [
    {
      icon: 'pencil-outline',
      name: 'edit',
      type: MultiActionEnum.EDIT,
    },
    {
      icon: 'trash-outline',
      name: 'delete',
      type: MultiActionEnum.DELETE,
    },
  ],
  editActions: [
    { type: ActionEnum.CANCEL },
    { type: ActionEnum.DUPLICATE },
    { type: ActionEnum.DELETE },
  ],
};