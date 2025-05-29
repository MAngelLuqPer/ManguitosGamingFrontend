
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
    'index.csr.html': {size: 31578, hash: '005bf406ebc500790571eb2a6ad8e7a69da98de5a20ce098391e99b68eb54170', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17297, hash: '3b33bf4fe934f0e944c8935590b9d83328d211f3119ed9542c127c0fba5d7258', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ASMODQPY.css': {size: 411850, hash: '4uxy3U3XRPI', text: () => import('./assets-chunks/styles-ASMODQPY_css.mjs').then(m => m.default)}
  },
};
