
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
    "route": "/comunidad/*"
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
    "route": "/register"
  },
  {
    "renderMode": 0,
    "route": "/login"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 31578, hash: 'b8c390cca3ab9f998314830b597b97d300e6bfce4c64d443fc40d18c615f3616', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17297, hash: '4df07fbb61f17f7dc070504ec930863c16df3175c75ac2146f337b5cb1d2a1b2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-2BGKCBWE.css': {size: 411794, hash: 'VrZEimh5sYM', text: () => import('./assets-chunks/styles-2BGKCBWE_css.mjs').then(m => m.default)}
  },
};
