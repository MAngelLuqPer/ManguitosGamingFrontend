import { TestBed } from '@angular/core/testing';

import { ComentariosApiService } from './comentarios-api.service';

describe('ComentariosApiService', () => {
  let service: ComentariosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentariosApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
