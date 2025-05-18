import { CanActivateFn, Router } from '@angular/router';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const usuario = localStorage.getItem('usuario');
  const comunidadId = route.paramMap.get('id'); // Obtener el ID de la comunidad desde la ruta
  const idUsuAdmin = route.queryParamMap.get('idUsuAdmin'); // Obtener el parámetro de consulta correctamente
  if (usuario && comunidadId && idUsuAdmin) {
    const usuarioData = JSON.parse(usuario);

    // Verificar si el usuario es el creador de la comunidad
    if (usuarioData.id === parseInt(idUsuAdmin, 10)) {
      return true; // Permitir acceso si es el creador
    }
  }

  const router = new Router(); // Crear una instancia del Router
  router.navigate(['/']); // Redirigir al inicio si no es el creador
  return false;
};