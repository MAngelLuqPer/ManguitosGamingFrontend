import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { ComunidadesApiService } from './services/API/comunidades-api.service';
export const serverRoutes: ServerRoute[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'comunidad/:id', // This renders the "/comunidad/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'crear-publicacion/:id', // This renders the "/crear-publicacion/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'crear-comunidad', // This renders the "/crear-comunidad" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'register', // This renders the "/register" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'login', // This renders the "/login" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'publicacion/:id', // This renders the "/publicacion/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'administrar-comunidad/:id', // This renders the "/administrar-comunidad/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'comunidad/editar/:id', // This renders the "/comunidad/editar/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'usuario/:id', // This renders the "/usuario/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'editar-usuario/:id', // This renders the "/editar-usuario/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'comunidad/graficas/:id', // This renders the "/comunidad/graficas/:id" route on the server (SSR)
    renderMode: RenderMode.Server,
  }
];
