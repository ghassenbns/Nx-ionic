import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spectator } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';

import { BooleanState, CardConfigInterface } from '../../interfaces';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spectator: Spectator<CardComponent>;
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  const cardConfig: CardConfigInterface = {
    selector: 'test-card',
    title: 'Test Card',
    editable: { state : true },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent],
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
    });

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.cardConfig = cardConfig;
    component.editMode = new BehaviorSubject<BooleanState>({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly when cardConfig is editable', () => {
    component.ngOnInit();
    expect(component['IS_EDITING_STATE']).toEqual({ 'test-card': true });
    expect(component['NOT_EDITING_STATE']).toEqual({ 'test-card': false });
  });

  it('should emit submitEvent when onSubmit is called', () => {
    const emitSpy = jest.spyOn(component.submitEvent, 'emit');
    component.onSubmit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should toggle edit mode and emit events when toggleEditMode is called', () => {
    const isEditingEmitSpy = jest.spyOn(component.isEditingEvent, 'emit');
    const cancelEmitSpy = jest.spyOn(component.cancelEvent, 'emit');

    component.toggleEditMode(true);
    expect(isEditingEmitSpy).toHaveBeenCalled();

    component.toggleEditMode(false);
    expect(cancelEmitSpy).toHaveBeenCalled();
  });

  it('should call toggleEditMode with false when onCancel is called', () => {
    const toggleEditModeSpy = jest.spyOn(component, 'toggleEditMode');
    component.onCancel();
    expect(toggleEditModeSpy).toHaveBeenCalledWith(false);
  });
});
