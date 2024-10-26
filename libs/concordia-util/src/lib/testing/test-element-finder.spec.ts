import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestElementFinder } from './test-element-finder';
import {
  TestElementFinderResultCombined,
  TestElementFinderResultMultiple,
  TestElementFinderResultSingle,
} from './test-element-finder-result.interface';

@Component({
  template: `
    <span data-test-id="one">one</span>
    <span data-test-id="two">two</span>
    <span data-test-id="three">three</span>
    <span data-test-id="many">many1</span>
    <span data-test-id="many">many2</span>
    <span data-test-id="many">many3</span>
    <span data-test-id="manyMore">manyMore1</span>
  `,
})
class TestComponent { }

describe('TestElementFinder', () => {

  let fixture: ComponentFixture<TestComponent>;

  const compile = (): any => {
    fixture = TestBed.createComponent(TestComponent);
  };

  const elementsSingle = TestElementFinder.configureTestIdFinder([
    'one',
    'two',
    'three',
    'many',
  ]);

  const elementsMultiple = TestElementFinder.configureTestIdFinder([
    ['many', 'multiple'],
    ['manyMore', 'multiple'],
  ]);

  const elementsCombinedSingleThenArray = TestElementFinder.configureTestIdFinder([
    'one',
    'two',
    'three',
    ['many', 'multiple'],
    ['manyMore', 'multiple'],
  ]);

  const elementsCombinedArrayThenSingle = TestElementFinder.configureTestIdFinder([
    ['many', 'multiple'],
    ['manyMore', 'multiple'],
    'one',
    'two',
    'three',
  ]);

  beforeEach(waitForAsync(() => {

    TestBed
      .configureTestingModule({
        declarations: [
          TestComponent,
        ],
      })
      .compileComponents();

  }));

  it('should have intellisense for finder result single', () => {

    compile();

    fixture.detectChanges();

    const els: TestElementFinderResultSingle<'one' | 'two' | 'three' | 'many'> = elementsSingle(fixture);

    expect(els.one.nativeElement.textContent).toContain('one');
    expect(els.two.nativeElement.textContent).toContain('two');
    expect(els.three.nativeElement.textContent).toContain('three');
    expect(els.many.nativeElement.textContent).toContain('many1');

  });

  it('should have intellisense for finder result multiple', () => {

    compile();

    fixture.detectChanges();

    const els: TestElementFinderResultMultiple<'many' | 'manyMore'> = elementsMultiple(fixture);

    expect(els.many.length).toBe(3);
    expect(els.many[0].nativeElement.textContent).toContain('many1');
    expect(els.many[1].nativeElement.textContent).toContain('many2');
    expect(els.many[2].nativeElement.textContent).toContain('many3');

    expect(els.manyMore.length).toBe(1);
    expect(els.manyMore[0].nativeElement.textContent).toContain('manyMore1');

  });

  it('should have intellisense for finder result combined', () => {

    compile();

    fixture.detectChanges();

    const els: TestElementFinderResultCombined<'one' | 'two' | 'three', 'many' | 'manyMore'>
      = elementsCombinedSingleThenArray(fixture);

    expect(els.one.nativeElement.textContent).toContain('one');
    expect(els.two.nativeElement.textContent).toContain('two');
    expect(els.three.nativeElement.textContent).toContain('three');
    expect(els.many.length).toBe(3);
    expect(els.many[0].nativeElement.textContent).toContain('many1');
    expect(els.manyMore.length).toBe(1);

  });

  it('should find single elements', () => {

    compile();

    fixture.detectChanges();

    const els = elementsSingle(fixture);

    expect(els.one.nativeElement.textContent).toContain('one');
    expect(els.two.nativeElement.textContent).toContain('two');
    expect(els.three.nativeElement.textContent).toContain('three');
    expect(els.many.nativeElement.textContent).toContain('many1');

  });

  it('should find multiple elements', () => {

    compile();

    fixture.detectChanges();

    const els = elementsMultiple(fixture);

    expect(els.many.length).toBe(3);
    expect(els.many[0].nativeElement.textContent).toContain('many1');
    expect(els.many[1].nativeElement.textContent).toContain('many2');
    expect(els.many[2].nativeElement.textContent).toContain('many3');

    expect(els.manyMore.length).toBe(1);
    expect(els.manyMore[0].nativeElement.textContent).toContain('manyMore1');

  });

  it('should find combined elements variation - single then multiple', () => {

    compile();

    fixture.detectChanges();

    const els = elementsCombinedSingleThenArray(fixture);

    expect(els.one.nativeElement.textContent).toContain('one');
    expect(els.two.nativeElement.textContent).toContain('two');
    expect(els.three.nativeElement.textContent).toContain('three');

    expect(els.many.length).toBe(3);
    expect(els.many[0].nativeElement.textContent).toContain('many1');
    expect(els.many[1].nativeElement.textContent).toContain('many2');
    expect(els.many[2].nativeElement.textContent).toContain('many3');

    expect(els.manyMore.length).toBe(1);
    expect(els.manyMore[0].nativeElement.textContent).toContain('manyMore1');

  });

  it('should find combined elements variation - multiple then single', () => {

    compile();

    fixture.detectChanges();

    const els = elementsCombinedArrayThenSingle(fixture);

    expect(els.one.nativeElement.textContent).toContain('one');
    expect(els.two.nativeElement.textContent).toContain('two');
    expect(els.three.nativeElement.textContent).toContain('three');

    expect(els.many.length).toBe(3);
    expect(els.many[0].nativeElement.textContent).toContain('many1');
    expect(els.many[1].nativeElement.textContent).toContain('many2');
    expect(els.many[2].nativeElement.textContent).toContain('many3');

    expect(els.manyMore.length).toBe(1);
    expect(els.manyMore[0].nativeElement.textContent).toContain('manyMore1');

  });

});
