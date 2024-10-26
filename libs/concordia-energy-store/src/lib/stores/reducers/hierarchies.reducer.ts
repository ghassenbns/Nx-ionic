import { Status } from '@concordia-nx-ionic/concordia-core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HierarchiesActions } from '../actions';

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: a => a?.data._id,
});

export interface HierarchiesState extends EntityState<any> {
  hierarchiesList: any[];
  selected: string | null,
  status: {
    load: Status;
    load_list: Status;
  };
}

export const initialState: HierarchiesState = adapter.getInitialState({
  hierarchiesList: [],
  selected: null,
  status: {
    load: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_list: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
  },
});

export const reducer = createReducer(
  initialState,
  on(HierarchiesActions.loadHierarchies, state => ({
      ...state,
      status: {
        ...state.status,
        load: {
          ...state.status.load,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(HierarchiesActions.loadHierarchiesSuccess,
    (state) => ({
      ...state,
      status: {
        ...state.status,
        load: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(HierarchiesActions.loadHierarchiesFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(HierarchiesActions.addHierarchies,
    (state, { hierarchies }) => {
      return adapter.upsertOne(hierarchies, state);
    },
  ),
  on(HierarchiesActions.setSelectedHierarchies,
    (state, { hierarchyId }) => ({
      ...state,
      selected: hierarchyId,
    }),
  ),

  on(HierarchiesActions.loadHierarchiesList, state => ({
      ...state,
      status: {
        ...state.status,
        load_list: {
          ...state.status.load_list,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(HierarchiesActions.loadHierarchiesListSuccess,
    (state, { list }) => ({
      ...state,
      hierarchiesList: list,
      status: {
        ...state.status,
        load: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(HierarchiesActions.loadHierarchiesListFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_list: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectHierarchies = selectAll;
export const selectHierarchiesEntities = selectEntities;
