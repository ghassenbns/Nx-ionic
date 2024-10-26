import {
  ActionEnum, ModeEnum,
  MultiActionEnum,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';

export const hierarchiesDataConfig: Strategy = {
  name: 'hierarchy',
  entity: 'hierarchy',
  column: 2,
  columns: [
    {
      field: 'name',
      contentType: 'string',
      fixed: true,
      filterType: 'string',
      rowSelector: 'name',
      searchType: 'text',
      required: true,
      options: [],
      colspan: 2,
      link: {
        field: '_id',
        pref: '/energy/meters/hierarchies',
        sfx: '',
      },
    },
    {
      field: 'description',
      contentType: 'string',
      fixed: false,
      filterType: 'string',
      rowSelector: 'description',
      searchType: 'text',
      required: true,
      options: [],
      colspan: 2,
    },
    {
      field: 'public',
      contentType: 'switch',
      filterType: 'boolean',
      actions: [
        {
          value: true,
          icon: 'eye-outline',
          background: 'success',
          fill: 'solid',
          color: 'light',
          name: 'table.makePrivate',
          type: ActionEnum.DEACTIVATE,
        },
        {
          value: false,
          icon: 'eye-off-outline',
          background: 'light',
          fill: 'solid',
          color: 'dark',
          name: 'table.makePublic',
          type: ActionEnum.ACTIVATE,
        },
      ],
      rowSelector: 'isPublic',
      searchType: 'select',
      editType: 'switch',
      required: true,
      defaultValue: false,
      options: [
        { name: 'yes', _id: true },
        { name: 'no', _id: false },
      ],
      optionsTranslate: true,
    },
    {
      field: 'leaf',
      contentType: 'switch',
      filterType: 'boolean',
      rowSelector: 'isLeaf',
      searchType: 'select',
      editType: 'switch',
      required: true,
      disabled: false,
      hidden: [ ModeEnum.LIST_VIEW ],
      defaultValue: false,
      options: [
        { name: 'yes', _id: true },
        { name: 'no', _id: false },
      ],
      optionsTranslate: true,
    },
    {
      field: 'owner',
      contentType: 'string',
      filterType: 'int',
      rowSelector: 'owner.name',
      rowEditSelector: 'ownerId',
      searchType: 'selectSearch',
      searchSelector: 'ownerId',
      options: [],
      required: true,
      disabled: false,
      optionsField: 'name',
      optionsGroup: 'userLevelId',
      optionsValue: 'userId',
      colspan: 2,
    },
    {
      field: 'viewers',
      contentType: 'string',
      filterType: 'int',
      colspan: 2,
      addFilter: false,
      rowSelector: 'viewersId',
      rowEditSelector: 'viewerIds',
      searchType: 'multiSelectSearch',
      hidden: [ ModeEnum.LIST_VIEW ],
      options: [],
      defaultValue: [],
      required: false,
      disabled: false,
      optionsField: 'name',
      optionsValue: 'userId',
    },
  ],
  actions: [
    { type: ActionEnum.EDIT },
    { type: ActionEnum.DUPLICATE },
    { type: ActionEnum.DELETE },
  ],
  multiActions: [
    {
      icon: 'eye-outline',
      name: 'makePublic',
      type: MultiActionEnum.ACTIVATE,
    },
    {
      icon: 'eye-off-outline',
      name: 'makePrivate',
      type: MultiActionEnum.DEACTIVATE,
    },
    {
      icon: 'trash-outline',
      name: 'delete',
      type: MultiActionEnum.DELETE,
    },
  ],
};
