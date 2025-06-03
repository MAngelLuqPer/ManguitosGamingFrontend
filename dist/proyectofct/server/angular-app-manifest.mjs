
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/usuario/*"
  },
  {
    "renderMode": 0,
    "route": "/editar-usuario/*"
  },
  {
    "renderMode": 0,
    "route": "/comunidad/*"
  },
  {
    "renderMode": 0,
    "route": "/comunidad/editar/*"
  },
  {
    "renderMode": 0,
    "route": "/crear-publicacion/*"
  },
  {
    "renderMode": 0,
    "route": "/crear-comunidad"
  },
  {
    "renderMode": 0,
    "route": "/publicacion/*"
  },
  {
    "renderMode": 0,
    "route": "/administrar-comunidad/*"
  },
  {
    "renderMode": 0,
    "route": "/register"
  },
  {
    "renderMode": 0,
    "route": "/login"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 15674, hash: '0f3e2338612490d9a3b2be5621e7af1e6eaad8c344dd3e4b87cf7d31a2f779a2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1393, hash: '85cd5bab9216506cd514788df34e06967d2a79e8b091d5d7588c965bf2c75aee', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ASMODQPY.css': {size: 411850, hash: '4uxy3U3XRPI', text: () => import('./assets-chunks/styles-ASMODQPY_css.mjs').then(m => m.default)}
  },
};
