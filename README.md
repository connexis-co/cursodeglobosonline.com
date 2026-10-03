# Curso de Globos Online · EmDash

Sitio Astro 7 con EmDash 1.1 y tema propio `globos-classic`. Los contenidos publicados en el CMS se sirven mediante SSR y no requieren recompilar.

| Entorno | Sitio | Administración |
| --- | --- | --- |
| Producción | https://cursodeglobosonline.com | https://cursodeglobosonline.com/_emdash/admin |
| Desarrollo privado | https://dev.cursodeglobosonline.com | https://dev.cursodeglobosonline.com/_emdash/admin |

Usuario administrador solicitado: `sably`. Las contraseñas se almacenan como secretos de Cloudflare, nunca en Git. Las bases de contenido, archivos y sesiones de ambos entornos son independientes. Publicar en desarrollo no modifica producción.

## Trabajo local y despliegue

Usar Node 24 y `npm ci`.

```sh
npm run dev
npm run test:migration
npm run check
npm run deploy:dev
# Solo para publicar código validado en el dominio principal:
npm run deploy:prod
```

`npm run build` y `npm run deploy` corresponden a desarrollo. `build:prod` selecciona explícitamente `wrangler.production.jsonc`; cada desplegador valida los recursos de destino. Desplegar código **nunca** ejecuta el seed ni importa de nuevo el contenido.

## Contenido y módulos

- 4 cursos y 28 artículos, relacionados con autores, temas, países, ciudades y categorías.
- Páginas, menús y SEO nativo editables en el panel; revisiones pendientes separadas de lo publicado.
- WhatsApp configurable; 11 campañas de promociones en borrador hasta verificar ofertas y fechas.
- Comentarios moderados y estrellas reales de cursos y artículos.
- Brevo preparado con `contacto@sably.co`; falta configurar su API key y probar la entrega.
- El formulario de contacto abre WhatsApp. La bandeja de contactos sigue pendiente; no se afirma que los guarde.

## Documentación

- [Operación y mapa de contenido](docs/migration/README.md)
- [Lanzamiento, recursos y reversión](docs/migration/PRODUCTION.md)
- [Auditoría SEO y limitación de Ahrefs](docs/seo/2026-10-03-launch.md)
- [Datos de Search Console](docs/seo/2026-10-03-search-console.md)
- [Plugins y pendientes](docs/migration/PLUGINS.md)

Las instrucciones de la implementación estática anterior se conservan únicamente como referencia en [LEGACY_README.md](docs/migration/LEGACY_README.md).
