import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Observable, of, throwError } from 'rxjs';

import { ENTITY_API_SERVICE } from '../tokens/entity-service.token';
import { EntityDetailsComponent } from './entity-details.component';

class MockEntityApiService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show(id: string, options?: any): Observable<unknown> {
    return of({ data: 'mock data' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  edit(body: unknown[], options?: any): Observable<unknown> {
    return of('mock response');
  }
}

describe('EntityDetailsComponent', () => {
  let spectator: Spectator<EntityDetailsComponent<MockEntityApiService>>;
  const createComponent = createComponentFactory({
    component: EntityDetailsComponent,
    declarations: [], // Add any necessary declarations here
    providers: [
      { provide: ENTITY_API_SERVICE, useClass: MockEntityApiService },
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 'mock-id' }),
        },
      },
      Router,
    ],
    mocks: [IonContent],
  });

  beforeEach(() => {
    spectator = createComponent();
  });
  it('should fetch entity details from query ID', () => {
    const mockParams = { id: 'mock-id' };
    spectator.inject(ActivatedRoute).params = of(mockParams);
    const mockResponse = { data: 'mock data' };
    const mockEntityApiService =
      spectator.inject<MockEntityApiService>(ENTITY_API_SERVICE);
    const showSpy = jest.spyOn(mockEntityApiService, 'show');
    showSpy.mockReturnValue(of(mockResponse));

    const onErrorRedirectionPath = '/mock-path';
    const result$ = spectator.component
      .getEntityFromQueryId(onErrorRedirectionPath)
      .subscribe();
    expect(result$).toBeTruthy();

    expect(showSpy).toHaveBeenCalledWith('mock-id', {
      params: { details: true },
    });

    // Additional assertions on the result$ observable if necessary
  });
  it('should handle errors when fetching entity details', fakeAsync(() => {
    const mockParams = { id: 'mock-id' };
    spectator.inject(ActivatedRoute).params = of(mockParams);
    const mockError = { message: 'error' };
    const mockEntityApiService =
      spectator.inject<MockEntityApiService>(ENTITY_API_SERVICE);
    jest
      .spyOn(mockEntityApiService, 'show')
      .mockReturnValue(throwError(() => mockError));
    const router = spectator.inject(Router);
    const routerSpy = jest.spyOn(router, 'navigate').mockReturnValue({});

    const onErrorRedirectionPath = '/mock-path';
    const result$ = spectator.component.getEntityFromQueryId(
      onErrorRedirectionPath,
    );

    tick();
    expect(() => {
      result$.subscribe();
      tick();
    }).toThrowError();
    expect(routerSpy).toHaveBeenCalledWith([onErrorRedirectionPath]);
  }));
});
