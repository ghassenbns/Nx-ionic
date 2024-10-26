import { TimezoneInterface } from '@concordia-nx-ionic/concordia-api';
import { createSelector, MemoizedSelector } from '@ngrx/store';

import { selectTimezonesState } from '../reducers';

export const selectTimezones = createSelector(
  selectTimezonesState,
  state => state.timezones,
);

export const selectTimezone = (props: {
  timezoneId: number
}): MemoizedSelector<object, TimezoneInterface | undefined> => {
  return createSelector(
    selectTimezonesState,
    state => state.timezones.find(tz => tz.timezoneId === props.timezoneId),
  );
};
