import { Strategy } from '@concordia-nx-ionic/concordia-shared';

import { defaultSignalsEditConfig } from '../default/editConfig';

export const lithuaniaSignalsEditConfig: Strategy = {
  ...defaultSignalsEditConfig,
  columns: [...defaultSignalsEditConfig.columns,

    {
      field: 'ref',
      contentType: 'string',
      rowSelector: 'ref',
      rowEditSelector: 'ref',
      searchType: 'text',
      searchSelector: 'ref',
      editType: 'text',
      filterType: 'string',
      options: [],
    },
    {
      field: 'group',
      contentType: 'string',
      rowSelector: 'group',
      rowEditSelector: 'group',
      searchType: 'text',
      searchSelector: 'group',
      editType: 'text',
      filterType: 'string',
      options: [],
    },
    {
      field: 'groupRef',
      contentType: 'string',
      rowSelector: 'groupRef',
      rowEditSelector: 'groupRef',
      searchType: 'text',
      searchSelector: 'groupRef',
      editType: 'text',
      filterType: 'string',
      options: [],
    },

  ],
};
