import { definePlugin } from 'emdash';
import { readAll, rowData } from '@/lib/emdash-content';
import {
  HOTMART_HOSTS,
  checkoutPrice,
  compareOffer,
  isHotmartUrl,
  parsePromotion,
  promotionState,
  type OfferCheck,
} from './model';

/**
 * Promociones: el calendario del panel y la comprobación del cupón contra Hotmart.
 *
 * Quien aplica la campaña al sitio es la capa de datos (`lib/promotions.ts`): precio, tachado,
 * enlace con cupón y cuenta atrás salen de la campaña publicada y verificada. Este plugin no
 * inyecta nada en las páginas; la barra es `PromoBar.astro`, del tema.
 */

/** Las claves del CMS llegan en snake_case; el modelo las espera en camelCase. */
const camel = (data: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()), value]),
  );

const BROWSER = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  'Accept-Language': 'es',
};

export function createPlugin() {
  return definePlugin({
    id: 'globos-promotions',
    version: '1.0.0',
    capabilities: ['content:read', 'network:request'],
    allowedHosts: HOTMART_HOSTS,
    admin: { pages: [{ path: '/calendar', label: 'Calendario de promociones', icon: 'calendar' }] },
    routes: {
      calendar: {
        methods: ['GET'],
        permission: 'content:read_drafts',
        request: { body: 'none' },
        handler: async (ctx) => {
          const items = [];
          let cursor: string | undefined;
          do {
            const page = await ctx.content!.list('promotions', { limit: 100, cursor });
            items.push(...page.items);
            cursor = page.hasMore ? page.cursor : undefined;
          } while (cursor);
          const now = Date.now();
          return {
            now,
            items: items
              .filter((item) => item.status !== 'trash')
              .map((item) => {
                const promo = parsePromotion(camel(item.data), item.slug ?? item.id);
                return {
                  id: item.id,
                  slug: item.slug,
                  status: item.status,
                  state: promotionState(promo, item.status === 'published', now),
                  title: promo.title,
                  label: promo.label,
                  headline: promo.headline,
                  startsAt: promo.startsAt,
                  endsAt: promo.endsAt,
                  coupon: promo.coupon,
                  discountPct: promo.discountPct ?? null,
                  urlKey: promo.urlKey,
                  priority: promo.priority,
                  theme: promo.theme,
                  offerVerified: promo.offerVerified === true,
                  notes: String(item.data.verification_notes ?? ''),
                  source: String(item.data.calendar_source ?? ''),
                };
              }),
          };
        },
      },

      /**
       * Abre el checkout de cada curso con el cupón de la campaña y compara lo que cobra Hotmart
       * con lo que publicaría el sitio. No cambia nada: informa para decidir si se publica.
       */
      verify: {
        methods: ['POST'],
        permission: 'content:read_drafts',
        request: { body: 'json', maxBytes: 1024 },
        handler: async (ctx) => {
          const id = String((ctx.input as { id?: unknown } | null)?.id ?? '');
          const item = id ? await ctx.content!.get('promotions', id) : null;
          if (!item) throw new Error('No se encontró la campaña.');
          const promo = parsePromotion(camel(item.data), item.slug ?? item.id);
          if (!promo.coupon || !promo.discountPct) {
            throw new Error('Escribe el cupón de Hotmart y el porcentaje en la campaña antes de comprobarla.');
          }
          const courses = (await readAll('courses')).map((row) => ({ slug: row.id, ...rowData(row) })) as {
            slug: string;
            title?: string;
            priceUsd?: number;
            originalPriceUsd?: number;
            hotmartUrl?: string;
          }[];
          const checks: (OfferCheck & { title: string })[] = await Promise.all(
            courses.map(async (course) => {
              const title = String(course.title ?? course.slug);
              const listPrice = course.originalPriceUsd ?? course.priceUsd;
              if (!course.hotmartUrl || !isHotmartUrl(course.hotmartUrl)) {
                return { course: course.slug, title, ok: false, note: 'El curso no tiene un enlace de Hotmart válido.' };
              }
              const url = new URL(course.hotmartUrl);
              url.searchParams.set('offDiscount', promo.coupon!);
              let charged: number | undefined;
              try {
                const response = await ctx.http!.fetch(url.href, { headers: BROWSER });
                if (response.ok) charged = checkoutPrice(await response.text());
              } catch (error) {
                ctx.log.warn('No se pudo abrir el checkout', { course: course.slug, error: String(error) });
              }
              return { ...compareOffer(course.slug, listPrice, promo.discountPct, charged), title };
            }),
          );
          return {
            checkedAt: new Date().toISOString(),
            coupon: promo.coupon,
            discountPct: promo.discountPct,
            allOk: checks.length > 0 && checks.every((check) => check.ok),
            checks,
          };
        },
      },
    },
  });
}
