import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePopoverComponent } from './date-popover.component';

xdescribe('DatePopoverComponent', () => {
  let component: DatePopoverComponent;
  let fixture: ComponentFixture<DatePopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
