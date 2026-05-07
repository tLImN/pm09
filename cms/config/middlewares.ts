import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          'connect-src': ["'self'", 'http:', 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'http:', 'https:'],
          'style-src': ["'self'", "'unsafe-inline'"],
        },
        upgradeInsecureRequests: null,
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000',
        'https://7829960-zf629738.twc1.net',
        'http://7829960-zf629738.twc1.net',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
