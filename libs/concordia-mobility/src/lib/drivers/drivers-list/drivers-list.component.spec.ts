import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { DriversListComponent } from './drivers-list.component';

describe('DriversListComponent', () => {
  let component: DriversListComponent;
  let fixture: ComponentFixture<DriversListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriversListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { en: {}, es: {} },
          translocoConfig: {
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DriversListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
