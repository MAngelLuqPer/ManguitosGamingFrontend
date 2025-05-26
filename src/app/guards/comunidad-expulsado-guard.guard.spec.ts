import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { comunidadExpulsadoGuard } from './comunidad-expulsado-guard.guard';

describe('comunidadExpulsadoGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => comunidadExpulsadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
