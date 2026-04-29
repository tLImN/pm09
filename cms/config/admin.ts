import type { Core } from '@strapi/strapi';

interface PreviewHandlerParams {
  documentId: string;
  locale?: string;
  status?: string;
  document?: Record<string, unknown>;
}

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      maxSessionLifespan: env.int('ADMIN_SESSION_LIFESPAN', 7 * 24 * 60 * 60), // 7 days in seconds
      maxRefreshTokenLifespan: env.int('ADMIN_REFRESH_TOKEN_LIFESPAN', 30 * 24 * 60 * 60), // 30 days in seconds
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      handler: async (uid: string, params: PreviewHandlerParams) => {
        const secret = env('PREVIEW_SECRET', 'strapi-preview-secret');
        const baseUrl = env('FRONTEND_URL', 'http://localhost:3000');
        const strapiUrl = env('STRAPI_URL', 'http://localhost:1337');

        // Функция для получения полных данных из Strapi API
        async function fetchDocument(endpoint: string): Promise<Record<string, unknown>> {
          try {
            const res = await fetch(`${strapiUrl}/api${endpoint}`);
            const json = (await res.json()) as { data?: Record<string, unknown> };
            return json.data || {};
          } catch {
            return {};
          }
        }

        // Маршруты для каждого типа контента
        const routes: Record<string, () => Promise<string>> = {
          'api::catalog-item.catalog-item': async () => {
            // Получаем полные данные товара с populate категорий
            const item = await fetchDocument(
              `/catalog-items/${params.documentId}?populate[item_category]=true`
            );
            const itemSlug = item.item_slug as string;
            if (!itemSlug) return '/catalog';

            const categories = item.item_category;
            if (Array.isArray(categories) && categories.length > 0) {
              const catSlug = (categories[0] as Record<string, unknown>)?.category_slug as string;
              if (catSlug) {
                return `/catalog/${catSlug}/${itemSlug}`;
              }
            }
            return `/catalog/item/${itemSlug}`;
          },
          'api::category.category': async () => {
            // Получаем полные данные категории
            const category = await fetchDocument(
              `/categories/${params.documentId}`
            );
            const catSlug = category.category_slug as string;
            return catSlug ? `/catalog/${catSlug}` : '/catalog';
          },
          'api::about.about': async () => '/about',
          'api::contact.contact': async () => '/contacts',
          'api::payment.payment': async () => '/payment',
          'api::privacy.privacy': async () => '/licenses',
        };

        const pathBuilder = routes[uid];
        const path = pathBuilder ? await pathBuilder() : '/';

        return `${baseUrl}/api/preview?secret=${secret}&url=${encodeURIComponent(path)}`;
      },
      allowedOrigins: [env('FRONTEND_URL', 'http://localhost:3000')],
    },
  },
});

export default config;
