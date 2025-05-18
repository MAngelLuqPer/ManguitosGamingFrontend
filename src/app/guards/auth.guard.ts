import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const usuario = localStorage.getItem('usuario');
  if (usuario) {
    return true; // Permitir acceso si hay un usuario en localStorage
  } else {
    const router = new Router(); // Crear una instancia del Router
    router.navigate(['/']); // Redirigir al login si no hay usuario
    return false;
  }
};
