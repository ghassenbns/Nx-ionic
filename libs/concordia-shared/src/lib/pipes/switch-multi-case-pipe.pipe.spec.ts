import { SwitchMultiCasePipePipe } from './switch-multi-case-pipe.pipe';

describe('SwitchMultiCasePipePipe', () => {
  it('create an instance', () => {
    const pipe = new SwitchMultiCasePipePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a truthy value when the switchOption is present in the array', () => {
    const pipe = new SwitchMultiCasePipePipe();
    expect(pipe.transform(['option1', 'option2'], 'option1')).toBeTruthy();
  });

  it('should return a falsy value when the switchOption is not present in the array', () => {
    const pipe = new SwitchMultiCasePipePipe();
    expect(pipe.transform(['option1', 'option2'], 'option3')).toBeFalsy();
  });
});
