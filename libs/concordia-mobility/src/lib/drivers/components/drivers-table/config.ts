import { ActionEnum, MultiActionEnum, Strategy } from '@concordia-nx-ionic/concordia-shared';

export const driverDataConfig: Strategy = {
  name: 'drivers',
  entity: 'driver',
  columns: [
    {
      field: 'name',
      contentType: 'string',
      rowSelector: 'name',
      required: true,
      searchType: 'text',
      filterType: 'string',
      options: [],
      link: {
        field: '_id',
        pref: '/drivers',
        sfx: '',
      },
    },
    {
      field: 'description',
      contentType: 'string',
      rowSelector: 'description',
      required: true,
      searchType: 'text',
      filterType: 'string',
      options: [],
    },
    {
      field: 'fleet',
      contentType: 'string',
      rowSelector: 'fleetDetails.name',
      rowEditSelector: 'fleetId',
      required: true,
      searchType: 'multiSelectSearch',
      searchSelector: 'fleetId',
      editType: 'selectSearch',
      filterType: 'object-id',
      options: [],
    },
    {
      field: 'active',
      contentType: 'boolean',
      rowSelector: 'isActive',
      required: true,
      searchType: 'select',
      filterType: 'boolean',
      defaultValue: true,
      options: [
        { name: 'active', _id: true },
        { name: 'inactive', _id: false },
      ],
      optionsTranslate: true,
    },
    {
      field: 'vehicle',
      contentType: 'string',
      rowSelector: 'defaultVehicleDetails.name',
      rowEditSelector: 'defaultVehicleId',
      required: false,
      searchType: 'text',
      editType: 'selectSearch',
      filterType: 'string',
      optionsFilter: ['fleetId'],
      options: [],
    },
    {
      field: 'user',
      contentType: 'string',
      rowSelector: 'userDetails.name',
      rowEditSelector: 'userId',
      required: false,
      searchType: 'text',
      editType: 'selectSearch',
      filterType: 'string',
      optionsValue: 'userId',
      options: [],
      validators: ['noRepeat'],
    },
  ],
  actions: [
    { type: ActionEnum.INFO },
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
    {
      icon: 'pencil-outline',
      name: 'edit',
      type: MultiActionEnum.EDIT,
    },
  ],
  editActions: [
    { type: ActionEnum.CANCEL },
    { type: ActionEnum.DUPLICATE },
    { type: ActionEnum.DELETE },
  ],
};
