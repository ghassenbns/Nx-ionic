import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ }),
      ],
    });
    store = TestBed.inject(MockStore);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(store).toBeTruthy();
  });
});
