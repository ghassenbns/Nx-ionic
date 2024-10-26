import { ActionEnum, ModeEnum, MultiActionEnum, Strategy } from '@concordia-nx-ionic/concordia-shared';

export const defaultSignalListConfig: Strategy = {
  name: 'signals',
  entity: 'meterSignal',
  column: 2,
  columns: [
    {
      field: 'meterSignalId',
      contentType: 'hidden',
      rowSelector: 'meterSignalId',
      rowEditSelector: 'meterSignalId',
      required: true,
      searchType: 'hidden',
      searchSelector: 'meterSignalId',
      editType: 'hidden',
      filterType: 'array',
      options: [],
      hidden: [ModeEnum.LIST_VIEW],
    },
    { //meter id
      field: '_id',
      contentType: 'hidden',
      rowSelector: '_id',
      rowEditSelector: '_id',
      required: true,
      searchType: 'hidden',
      searchSelector: '_id',
      editType: 'hidden',
      filterType: 'array',
      options: [],
      hidden: [ModeEnum.LIST_VIEW],
    },
    {
      field: 'alias',
      contentType: 'string',
      rowSelector: 'alias',
      rowEditSelector: 'alias',
      required: true,
      fixed: true,
      searchType: 'text',
      searchSelector: 'alias',
      editType: 'text',
      filterType: 'string',
      options: [],
    },
    {
      field: 'node',
      contentType: 'string',
      rowSelector: 'node.name',
      rowEditSelector: 'nodeId',
      required: true,
      addFilter: false,
      searchType: 'hidden',
      searchSelector: 'nodeId',
      editType: 'selectSearch',
      filterType: 'array',
      options: [],
    },
    {
      field: 'compSignal',
      contentType: 'string',
      rowSelector: 'compSignal.name',
      rowEditSelector: 'compSignalId',
      required: true,
      searchType: 'hidden',
      editType: 'selectSearch',
      filterType: 'array',
      options: [],
      optionsValue: 'compSignalId',
    },
    {
      field: 'isCumulative',
      contentType: 'string',
      optionsTranslate: true,
      rowSelector: 'isCumulative',
      rowEditSelector: 'isCumulative',
      required: true,
      searchType: 'select',
      searchSelector: 'isCumulative',
      editType: 'select',
      filterType: 'boolean',
      defaultValue: false,
      translationPrefix: 'table.',
      options: [
        { name: 'yes', _id: true },
        { name: 'no', _id: false },
      ],
    },
    {
      field: 'signalType',
      contentType: 'string',
      rowSelector: 'signalType',
      rowEditSelector: 'signalType',
      required: true,
      searchType: 'multiSelectSearch',
      searchSelector: 'signalType',
      editType: 'selectSearch',
      filterType: 'array',
      options: [],
      optionsValue: 'signalType',
      optionsField: 'name',
      optionsGroup: 'group',
      optionsTranslate: true,
      translationPrefix: 'table.',

    },
    {
      field: 'signalSubtype',
      contentType: 'string',
      rowSelector: 'signalSubtype',
      rowEditSelector: 'signalSubtype',
      required: true,
      searchType: 'hidden',
      searchSelector: 'signalSubtype',
      editType: 'selectSearch',
      filterType: 'array',
      options: [],
      optionsValue: 'meterSignalSubtypeId',
      optionsField: 'name',
      optionsTranslate: true,
      translationPrefix: 'table.',

    },

  ],
  actions: [
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
    { type: ActionEnum.DELETE },
  ],
};
