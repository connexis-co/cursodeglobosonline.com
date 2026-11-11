import { definePlugin } from 'emdash';
import { DEFAULT_SETTINGS, validateSettings, type BalloonSettings } from './model';

/**
 * Opciones de los globos de página. El plugin solo guarda la configuración y la entrega a cada
 * página como `window.__globosBandada`; quien pinta y mueve los globos es BalloonFlock.astro.
 */
export function createPlugin() {
  return definePlugin({
    id: 'globos-balloons', version: '1.0.0', capabilities: ['hooks.page-fragments:register'],
    admin: { pages: [{ path: '/globos', label: 'Curso de Globos · Globos', icon: 'party-popper' }] },
    routes: {
      config: { methods: ['GET'], permission: 'settings:manage', request: { body: 'none' }, handler: async ctx => ({ config: { ...DEFAULT_SETTINGS, ...(await ctx.kv.get<BalloonSettings>('config')) } }) },
      save: { methods: ['POST'], permission: 'settings:manage', request: { body: 'json', maxBytes: 4096 }, handler: async ctx => {
        const config = validateSettings(ctx.input);
        await ctx.kv.set('config', config);
        return { config };
      } },
    },
    hooks: {
      'page:fragments': async ({ page }, ctx) => {
        const path = new URL(page.url).pathname;
        if (path.startsWith('/_emdash') || path.startsWith('/admin')) return null;
        const saved = await ctx.kv.get<BalloonSettings>('config');
        // Sin nada guardado, la página usa sus valores por defecto: no hace falta inyectar nada.
        if (!saved) return null;
        const config = { ...DEFAULT_SETTINGS, ...saved };
        return [{ kind: 'inline-script', placement: 'body:end', key: 'globos-balloons-config', code: `window.__globosBandada=${JSON.stringify(config)};` }];
      },
    },
  });
}
