# Tracking — GTM, GA4 y conversiones

## IDs auditados (sitio anterior, 2026-08-06)

| Ítem | Valor | Estado |
|---|---|---|
| GTM | `GTM-KKP7WL8Q` | ✅ Reutilizado en el sitio nuevo (`PUBLIC_GTM_ID`) |
| GA4 hardcoded | `G-WVTB898GPH` | ⚠️ NO migrado a propósito (doble firing) |
| GA4 vía GTM | `G-PHN6J5MTX6` | ✅ Sigue disparando desde el contenedor |
| Meta Pixel | — | No existía; crear y añadir vía GTM o `PUBLIC_META_PIXEL_ID` |
| Google Ads (AW-) | — | No existía; preparar tag de conversión en GTM |

**Decisión pendiente (JP):** consolidar en UNA propiedad GA4. Recomendación: quedarse con
`G-PHN6J5MTX6` (la del contenedor), y si se prefiere la otra, cambiar la etiqueta GA4 dentro
de GTM — el código del sitio no cambia.

## Taxonomía de eventos (dataLayer)

El sitio empuja estos eventos; crear los triggers/tags correspondientes en GTM:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `view_course` | Carga de página de curso | course_name, course_category, price, currency, country, discount_pct |
| `begin_checkout` | Click en CTA a Hotmart | los de view_course + placement (hero/final/sticky/landing_meta/landing_google) |
| `generate_lead` | Envío del formulario de asesoría | form_name, course_interest, country |
| `click_whatsapp` | Click en botón/float de WhatsApp | page_location, course_name |
| `select_country` | Cambio de país (header/footer/toast) | country_from, country_to, source |
| `view_faq` | Expandir una pregunta | faq_question, course_name |
| `view_certificate` | Click en CTA de sección certificado | course_name |
| `copy_discount_code` | Copiar cupón (cuando exista cupón textual) | discount_code, course_name |
| `scroll_depth` | 25/50/75/100% | percent, page_type |

Meta Pixel (cuando exista): el helper `trackEvent` ya mapea automáticamente
view_course→ViewContent, begin_checkout→InitiateCheckout, generate_lead→Lead,
click_whatsapp→Contact.

## Google Search Console

1. La propiedad de dominio ya debería existir (sitio con GSC previo); verificar acceso.
2. Tras el cutover DNS: enviar `https://cursodeglobosonline.com/sitemap-index.xml`.
3. Los sitemaps viejos de Rank Math redirigen 301 al nuevo índice.

Service account disponible: `agents-analytics-reader@connexis-co.iam.gserviceaccount.com`
(dar acceso en GSC/GA4 si se quiere automatizar reporting).

## UTM en checkouts Hotmart

Cada CTA agrega: `src=cursodeglobosonline&utm_source=cursodeglobosonline.com&utm_medium=web|paid`
`&utm_campaign=course_{slug}&utm_content={país}&utm_term={variant}` sin tocar los parámetros
originales del enlace (offDiscount viaja intacto).
