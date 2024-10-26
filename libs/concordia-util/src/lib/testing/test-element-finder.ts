/* eslint-disable  @typescript-eslint/no-explicit-any */
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Spectator, SpectatorDirective } from '@ngneat/spectator';

import {
  SpectatorFinderResult,
  TestElementFinderResultCombined,
  TestElementFinderResultMultiple,
  TestElementFinderResultSingle,
} from './test-element-finder-result.interface';

declare type QuerySingle<T extends string> = T;
declare type QueryMultiple<T extends string> = [T, 'multiple'];

declare type QueryCombined<T1 extends string, T2 extends string> = QuerySingle<T1> | QueryMultiple<T2>;

export class TestElementFinder {

  static configureTestIdFinder<T1 extends string>(query: Array<QuerySingle<T1>>):
    (fixture: ComponentFixture<any>) => TestElementFinderResultSingle<T1>;
  static configureTestIdFinder<T1 extends string>(query: Array<QueryMultiple<T1>>):
    (fixture: ComponentFixture<any>) => TestElementFinderResultMultiple<T1>;
  static configureTestIdFinder<T1 extends string, T2 extends string>(query: Array<QueryCombined<T1, T2>>):
    (fixture: ComponentFixture<any>) => TestElementFinderResultCombined<T1, T2>;
  static configureTestIdFinder<T1 extends string, T2 extends string>(query: Array<QueryCombined<T1, T2>>):
    (fixture: ComponentFixture<any>) => TestElementFinderResultCombined<T1, T2> {

    return (fixture: ComponentFixture<any>): TestElementFinderResultCombined<T1, T2> => {

      const elements: TestElementFinderResultCombined<T1, T2> = { } as any;

      for (const queryObject of query) {
        let id: T1 | T2;
        let type: 'query' | 'queryAll';

        if (Array.isArray(queryObject)) {
          id = queryObject[0];
          type = queryObject[1] === 'multiple' ? 'queryAll' : 'query';
        } else {
          id = queryObject;
          type = 'query';
        }

        elements[id] = fixture.debugElement[type](
          By.css(`[data-test-id="${id}"]`),
        ) as (DebugElement | DebugElement[]) as any;

      }

      return elements;

    };

  }

  static configureSpectatorFinder<T1 extends string, T2 extends string>(query: Array<QueryCombined<T1, T2>>):
    (fixture: Spectator<any> | SpectatorDirective<any>) => SpectatorFinderResult<T1, T2> {

    return (spectator: Spectator<any> | SpectatorDirective<any>): SpectatorFinderResult<T1, T2> => {
      const elements: SpectatorFinderResult<T1, T2> = { } as any;

      for (const queryObject of query) {
        let id: T1 | T2;

        if (Array.isArray(queryObject)) {
          id = queryObject[0];
          elements[id] = queryObject[1] === 'multiple'
            ? spectator.queryAll(`[data-test-id="${id}"]`)
            : spectator.query(`[data-test-id="${id}"]`) as any;

        } else {
          id = queryObject;
          elements[id] = spectator.query(`[data-test-id="${id}"]`) as any;
        }

      }

      return elements;

    };

  }

}
