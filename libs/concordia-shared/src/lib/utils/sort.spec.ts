import { sortFn } from './sort';

describe('sortFn', () => {

  it('should be 1', () => {

    const values = sortFn('asc');

    expect(values).toEqual(1);

  });

  it('should be -1', () => {

    const values = sortFn('desc');

    expect(values).toEqual(-1);

  });
});
