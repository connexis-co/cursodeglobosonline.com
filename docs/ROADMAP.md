# Roadmap — cursodeglobosonline.com

## ✅ v0.1.0 — Reconstrucción frontend (2026-08-06)

- [x] Auditoría del sitio WordPress (URLs, Hotmart, descuentos, tracking)
- [x] Análisis de referencias (LBD Balloons, academiadebelleza, sably, aprende)
- [x] Estudio de keywords (Ubersuggest) + proyecto con tracking en 8 países
- [x] Sistema de diseño anti-IA (OKLCH, Fraunces/Nunito, animaciones de globos)
- [x] 4 cursos reales con temarios auditados y enlaces de afiliado intactos
- [x] 8 países con hreflang, sitemaps segmentados, 301s completos
- [x] Landings Meta/Google Ads (noindex) + taxonomía GTM completa
- [x] Repo + CI/CD (GitHub Actions → Cloudflare Pages) + release-please

## ✅ v0.1.1 — Hiperlocal y salida a producción (2026-08-06)

- [x] **Capa hiperlocal**: 36 hubs `/{cc}/{ciudad}/` + 144 cursos por ciudad con contenido
  local único (`lib/cities.ts`) y malla de enlaces — 252 páginas totales
- [x] **Cutover DNS ejecutado**: cursodeglobosonline.com + www sirven el sitio nuevo desde
  Cloudflare Pages (proyecto `cursodeglobosonline-com`); el WordPress quedó fuera del dominio
- [x] **GSC**: sitemap-index.xml enviado a `sc-domain:cursodeglobosonline.com` vía API
  (service account agents-analytics-reader, siteOwner)
- [x] Imágenes Gemini (og-default.jpg + guirnalda del home) y globos SVG con anatomía LBD
  (floating 3s, delays negativos, parallax al scroll, XL sangrando de sección)
- [x] Portadas SVG ilustradas por curso (sin marcas de terceros)

### ⚠️ Pendientes operativos inmediatos

- [ ] Purgar caché de Cloudflare: el robots.txt viejo de WP sigue cacheado (expira ≤4h);
  el token API no tiene permiso Cache Purge — 1 click en dashboard (Caching → Purge Everything)
- [ ] Branch protection: GitHub la exige con plan Pro en repos privados (o repo público)
- [ ] Rotar credenciales compartidas por chat cuando termine la configuración (higiene)

## 🔜 v0.2.0 — Contenido y conversión

- [ ] **Cutover DNS** del dominio al proyecto de Cloudflare Pages (decisión JP)
- [ ] Verificar propiedad en GSC y enviar sitemap-index.xml
- [ ] Blog: cluster "como hacer arcos de globos" (3.700 búsquedas/mes MX+CO, SD 26-32)
  - como hacer arcos de globos (pilar) · sin estructura · sin base · marcas de globos ·
    cuánto dura un globo con helio · cuánto cobrar por un arco
- [ ] City landings CO con contenido único (bogota, medellin, cali, barranquilla, bucaramanga)
  y globoflexia por ciudad (recuperar las URLs geo del sitio viejo con 200, no 301)
- [ ] Testimonios reales desde Hotmart (reemplazar placeholders)
- [ ] Precios reales de Bouquets/Flores/Burbuja (acceso productor o confirmación JP)
- [ ] OG images reales por curso (Gemini API / fotos de montajes)
- [ ] Countdown de oferta si el productor confirma vigencia/rotación del offDiscount
- [ ] GTM: publicar contenedor con los triggers de la nueva taxonomía + Meta Pixel
- [ ] Test A/B: landing Ads vs página SEO (medir CVR/CPA por utm_term)

## 🧭 v0.3.0+ — Expansión

- [ ] Ciudades MX/PE + páginas de subcategoría con búsqueda local
- [ ] Swap de keywords en Ubersuggest (300/300 lleno — lista candidata en docs/seo/)
- [ ] Migrar assets a R2 + dominio assets.cursodeglobosonline.com
- [ ] Backend Laravel 13 (cursodeglobosonline-core): leads, webhooks Hotmart, precios dinámicos
- [ ] Cursos nuevos del nicho (arcos orgánicos, eventos, emprendimiento) cuando existan productos
