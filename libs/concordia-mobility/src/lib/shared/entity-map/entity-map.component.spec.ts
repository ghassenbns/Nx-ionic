import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ENTITY_API_SERVICE } from '@concordia-nx-ionic/concordia-shared';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';

import { EntityApiService, EntityMapComponent } from './entity-map.component';

class MockEntityApiService implements EntityApiService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLastPosition(entity: any): any {
    return of({ data: {} });
  }
}

describe('EntityMapComponent', () => {
  let spectator: Spectator<EntityMapComponent<MockEntityApiService>>;

  const createComponent = createComponentFactory({
    component: EntityMapComponent,
    providers: [
      {
        provide: ENTITY_API_SERVICE,
        useValue: new MockEntityApiService(),
      },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should call getLastPosition method of EntityApiService with correct entity', () => {
    const entity = { _id: 1 };

    const getLastPositionSpy = jest.spyOn(spectator.component['entityApiService'], 'getLastPosition')
      .mockReturnValue(of({ data: {} }));

    spectator.component.getMapData(entity).subscribe(() => {
      expect(getLastPositionSpy).toHaveBeenCalledWith(entity);
    });
  });

  //? ADD MORE TESTS HERE
});
