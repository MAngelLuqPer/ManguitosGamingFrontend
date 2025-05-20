import { TestBed } from '@angular/core/testing';

import { ReportesApiService } from './reportes-api.service';

describe('ReportesApiService', () => {
  let service: ReportesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
