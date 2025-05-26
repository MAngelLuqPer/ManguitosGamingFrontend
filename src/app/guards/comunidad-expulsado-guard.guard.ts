import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { PostsApiService } from '../services/API/posts-api.service';

export const comunidadExpulsadoGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const comunidadesApi = inject(ComunidadesApiService);
  const postsApi = inject(PostsApiService);

  const usuario = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('usuario') || 'null') : null;
  const publicacionId = route.paramMap.get('id');

  if (!usuario || !publicacionId) {
    router.navigate(['/']);
    return false;
  }

  try {
    // 1. Obtener la publicación
    const publicacion: any = await postsApi.getById(Number(publicacionId)).toPromise();
    if (!publicacion || !publicacion.comunidadId) {
      router.navigate(['/']);
      return false;
    }

    // 2. Consultar expulsados de la comunidad de la publicación
    const expulsados = await comunidadesApi.getUsuariosExpulsados(Number(publicacion.comunidadId)).toPromise();
    const expulsado = expulsados?.find((e: any) => e.usuarioId === usuario.id);

    if (expulsado) {
      const fechaFin = new Date(expulsado.fechaFin.replace('[UTC]', ''));
      const ahora = new Date();
      if (fechaFin > ahora) {
        router.navigate(['/comunidad', publicacion.comunidadId], { queryParams: { expulsado: '1' } });
        return false;
      }
    }
    return true;
  } catch {
    router.navigate(['/']);
    return false;
  }
};