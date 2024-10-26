import { DebugElement } from '@angular/core';

export type TestElementFinderResultSingle<T extends string> = {
  [key in T]: DebugElement;
};

export type TestElementFinderResultMultiple<T extends string> = {
  [key in T]: DebugElement[];
};

export type TestElementFinderResultCombined<T1 extends string, T2 extends string>
  = TestElementFinderResultSingle<T1> & TestElementFinderResultMultiple<T2>;

export type SpectatorFinderResult<T1 extends string, T2 extends string> =
  {
    [key in T1]: HTMLInputElement;
  }
  &
  {
    [key in T2]: HTMLInputElement[];
  };
