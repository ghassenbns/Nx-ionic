import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const loadHierarchiesList = createAction(
  '[Concordia Energy] Load Hierarchies List',
);

export const loadHierarchiesListSuccess = createAction(
  '[Concordia Energy] Load Hierarchies ListSuccess',
  props<{
    list: any[];
  }>(),
);

export const loadHierarchiesListFailure = createAction(
  '[Concordia Energy] Load Hierarchies List Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadHierarchies = createAction(
  '[Concordia Energy] Load Hierarchies',
  props<{
    hierarchyId: string;
  }>(),
);

export const addHierarchies = createAction(
  '[Concordia Energy] Add Hierarchies',
  props<{
    hierarchies: any;
  }>(),
);

export const setSelectedHierarchies = createAction(
  '[Concordia Energy] Selected Hierarchies',
  props<{
    hierarchyId: string | null;
  }>(),
);

export const loadHierarchiesSuccess = createAction(
  '[Concordia Energy] Load Hierarchies Success',
);

export const loadHierarchiesFailure = createAction(
  '[Concordia Energy] Load Hierarchies Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
