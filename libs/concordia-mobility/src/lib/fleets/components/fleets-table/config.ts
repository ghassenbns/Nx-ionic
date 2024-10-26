import {
  ActionEnum,
  MultiActionEnum,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';

export const fleetDataConfig: Strategy = {
  name: 'fleets',
  entity: 'fleet',
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
      link: {
        field: '_id',
        pref: '/fleets',
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
    },
    {
      field: 'active',
      contentType: 'boolean',
      filterType: 'boolean',
      rowSelector: 'isActive',
      searchType: 'select',
      required: true,
      defaultValue: true,
      options: [
        { name: 'active', _id: true },
        { name: 'inactive', _id: false },
      ],
      optionsTranslate: true,
    },
    {
      field: 'owner',
      contentType: 'string',
      filterType: 'string',
      rowSelector: 'ownerDetails.name',
      rowEditSelector: 'ownerId',
      searchType: 'text',
      editType: 'selectSearch',
      options: [],
      required: true,
      disabled: false,
      optionsValue: 'userId',
      optionsGroup: 'userLevelId',
    },
  ],
  actions: [
    { type: ActionEnum.EDIT },
    { type: ActionEnum.DELETE },
  ],
  multiActions: [
    {
      icon: 'checkmark-circle-outline',
      name: 'activate',
      type: MultiActionEnum.ACTIVATE,
    },
    {
      icon: 'close-circle-outline',
      name: 'deactivate',
      type: MultiActionEnum.DEACTIVATE,
    },
    {
      icon: 'trash-outline',
      name: 'delete',
      type: MultiActionEnum.DELETE,
    },
  ],
};
