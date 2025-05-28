
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
    'index.csr.html': {size: 31578, hash: '7917b9c3ccf2ac87533bfa600a0b9b763f27446f775ae231255e686099d8db26', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17297, hash: '339acdc7c0e5f61dff937c34bccfd2cdc0bf88f2a602fb9cf44e069fcfd04e31', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ASMODQPY.css': {size: 411850, hash: '4uxy3U3XRPI', text: () => import('./assets-chunks/styles-ASMODQPY_css.mjs').then(m => m.default)}
  },
};
