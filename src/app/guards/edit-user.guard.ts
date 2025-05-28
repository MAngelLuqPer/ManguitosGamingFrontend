import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const editUserGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
  const idAEditar = Number(route.paramMap.get('id'));

  if (usuarioLogado && usuarioLogado.id === idAEditar) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
