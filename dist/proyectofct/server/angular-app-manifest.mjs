
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
    'index.csr.html': {size: 31578, hash: '54a99f4d9dec72be86eb875c33cdcef716b3dea2885ec95e582e76a42a701cdc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17297, hash: 'a2d54eeaec6a3f28def625b1b4f63a54550e93e75b100799dfec024d22ed76a4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ASMODQPY.css': {size: 411850, hash: '4uxy3U3XRPI', text: () => import('./assets-chunks/styles-ASMODQPY_css.mjs').then(m => m.default)}
  },
};
