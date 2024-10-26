import { resetValue } from './resetValue';

describe('sortFn', () => {

  it('should be empty string', () => {

    const values = resetValue('string');

    expect(values).toEqual('');

  });

  it('should be null', () => {

    const values = resetValue('enum');

    expect(values).toBeNull();

  });

  it('should be throw null', () => {
    expect(() => {
      resetValue('number');
    }).toThrow();
  });
});
