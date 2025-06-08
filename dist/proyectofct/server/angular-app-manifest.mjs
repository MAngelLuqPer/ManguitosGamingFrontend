
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
    "route": "/comunidad/graficas/*"
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
    'index.csr.html': {size: 15650, hash: '6601ab92ec73ee3c6858d3f4461fd685c3b3ef233b0998e37b98f4f2fceb8199', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1393, hash: '194601e4ed14be15021ba04c3159f71fb5891ce393316664662d99e72d00ca6a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-GAVTTI6M.css': {size: 411825, hash: 'oKLrglpDy+g', text: () => import('./assets-chunks/styles-GAVTTI6M_css.mjs').then(m => m.default)}
  },
};
