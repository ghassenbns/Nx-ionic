import { CellArraySelectorPipe } from './cell-array-selector.pipe';
import { SwitchMultiCasePipePipe } from './switch-multi-case-pipe.pipe';
import { UserDatePipe } from './user-date.pipe';
import { UserDateFormatPipe } from './user-date-format.pipe';
import { UserNumberPipe } from './user-number.pipe';

export const pipes = [
  UserDatePipe,
  CellArraySelectorPipe,
  SwitchMultiCasePipePipe,
  UserNumberPipe,
  UserDateFormatPipe,
];

export * from './cell-array-selector.pipe';
export * from './switch-multi-case-pipe.pipe';
export * from './user-date.pipe';
export * from './user-date-format.pipe';
export * from './user-number.pipe';
