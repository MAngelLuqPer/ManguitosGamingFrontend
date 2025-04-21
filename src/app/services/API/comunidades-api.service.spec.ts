import { TestBed } from '@angular/core/testing';

import { ComunidadesApiService } from './comunidades-api.service';

describe('ComunidadesApiService', () => {
  let service: ComunidadesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunidadesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
