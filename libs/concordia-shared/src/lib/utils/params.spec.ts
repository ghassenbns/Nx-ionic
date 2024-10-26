import { paramsFn } from './params';

describe('paramsFn', () => {

  it('should be 1', () => {

    const values = paramsFn({
      first: 0,
      rows: 1,
      filters: {
        name: {
          'value': 'xxxx',
          'matchMode': 'like',
          'type': 'string',
        },
      },
      sortField: 'name',
      sortOrder: 1,
    });

    // eslint-disable-next-line
    expect(values.params.filter).toStrictEqual( `[{\"scope\":\"name\",\"operator\":\"like\",\"value\":\"xxxx\",\"type\":\"string\"}]`);

  });

  it('should be second page', () => {

    const values = paramsFn({
      first: 25,
      rows: 25,
      sortField: 'name',
      sortOrder: -1,
      filters: {},
    });

    // eslint-disable-next-line
    expect(values.params).toStrictEqual({ length: 25, page: 2, sort: '[{\"scope\":\"name\",\"value\":\"desc\"}]' });

  });

  it('should default value', () => {

    const values = paramsFn({
      filters: {},
    });

    expect(values.params).toStrictEqual({ length: 10, page: 1 });

  });
});
