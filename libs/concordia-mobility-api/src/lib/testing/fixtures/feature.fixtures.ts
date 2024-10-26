import { Feature } from '../../interfaces';

export const FEATURES_FIXTURE: Feature[] = [
  {
    id: '1',
    properties: '1',
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    state: {
      selected: false,
      hovered: false,
    },
  },
  {
    id: '2',
    properties: {
      address: 'Test address 2',
    },
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    state: {
      selected: false,
      hovered: false,
    },
  },
];
