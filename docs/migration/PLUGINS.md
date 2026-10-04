# Plugins evaluados y decisión para Globos

Revisión: 2 de octubre de 2026. Se revisaron la tienda oficial, documentación de EmDash y código del paquete SMTP. Las versiones son tempranas: la publicación en la tienda no sustituye pruebas en nuestro frontend.

| Necesidad | Opción | Decisión |
|---|---|---|
| Metadatos, canonical, Open Graph, noindex y datos estructurados | SEO nativo de EmDash y componentes del tema | Mantener como fuente principal; ya se probó que editar título/descripción cambia el HTML publicado. Evitar dos generadores de JSON-LD para una misma entidad. |
| Control editorial SEO | Publish Check 0.3.0, `@emdashplugins.bsky.social/publish-check` | Mejor candidato complementario: revisa títulos, descripción, encabezados, alt y enlaces antes de publicar. Empezar en modo aviso tras probar nuestros campos personalizados. No instalado en esta intervención. |
| Análisis por palabra clave, legibilidad y redirecciones | SEO Suite 0.2.0, `@nookeshk.bsky.social/seo-suite` | El catálogo anuncia esas funciones; no se pudo inspeccionar su ficha completa. No instalar ni llamarlo validado sin revisar implementación y conflictos con SEO nativo. |
| Contactos y bandeja de entradas | Forms 0.1.0, `@netdollar.dev/forms` | Recomendado: formularios, borradores/publicación, respuestas, CSV y protección con tickets de un uso. Requiere motor sandbox y paquete frontend. Su repositorio público permite revisar el flujo. No instalado; el formulario actual sigue abriendo WhatsApp y todavía no guarda contactos. |
| Formulario sencillo alternativo | Contact Forms 0.2.0, `@masonjames.com/contact-forms` | Bandeja, CSV y notificaciones. El autor indica que el repositorio fuente es privado y que no incluye CAPTCHA ni formularios multipágina. Menos adecuado si vamos a ampliar captación y lógica condicional. |
| Correo transaccional | SMTP de Mason James | Instalado `emdash-smtp@0.4.0` por npm, la versión nativa disponible. El registro ofrece distribución sandbox 0.4.1: son canales distintos. Brevo y `contacto@sably.co` configurados; clave ausente, entrega sin probar y ningún correo enviado. |
| Comentarios | Nativos de EmDash | Habilitados en el blog, con aprobación de todos los envíos y diseño propio del tema. No requiere instalar un plugin de comentarios. |
| Auditoría editorial | Simple History 0.2.0 | Candidato posterior si se incorporan más editores; las revisiones nativas siguen siendo la base. No instalado. |
| Optimización de imágenes | Image optimizer 0.1.0 | El catálogo lo describe como diagnóstico de solo lectura, no como transformador. No resuelve automáticamente las variantes responsive que necesitamos antes de producción. |

## Brevo

Abrir Plugins → SMTP Providers. El proveedor seleccionado es Brevo y el remitente es `contacto@sably.co`, nombre `Curso de Globos Online · Sably`, Reply-To en la misma dirección. Introducir la API key en el campo del plugin, validar el remitente/dominio en Brevo y después realizar una prueba de entrega a una dirección autorizada. La integración usa la API HTTPS de Brevo; no abre un socket SMTP desde Cloudflare. No se ha añadido una clave ficticia.

El paquete nativo contiene otros transportes; para este Worker solo se verificó la carga del panel y la configuración de Brevo. No se certifican sendmail ni SMTP TCP. Se fijó la dependencia transitiva Nodemailer 10.0.13 para eliminar los avisos de la versión antigua que traía el paquete. Los secretos del plugin se guardan en su almacenamiento privado de EmDash; el código 0.4.0 usa KV del plugin y enmascara la UI, sin declarar el cifrado de secretos de `settingsSchema`. No exportar esa configuración a Git ni compartir copias de la base.

## Captura de contactos pendiente

Instalar Forms exige habilitar el sandbox del registro y su binding Worker Loader, instalar el renderizador Astro, crear el formulario y sustituir la acción del formulario actual por su API de tickets/envío. Deben probarse guardado, permisos de lectura, rechazo de duplicados, consentimiento, curso seleccionado, página de origen y notificación por Brevo. Un clic a WhatsApp por sí solo no demuestra que un contacto se haya guardado. No se presenta esa función como implementada.

## Fuentes primarias

- [Registro oficial](https://plugins.emdashcms.com/)
- [Instalación y requisitos de sandbox](https://docs.emdashcms.com/plugins/installing/)
- [Publish Check](https://plugins.emdashcms.com/plugins/@emdashplugins.bsky.social/publish-check)
- [Forms y su integración](https://github.com/charl-kruger/emdash-forms)
- [Contact Forms](https://plugins.emdashcms.com/plugins/@masonjames.com/contact-forms)
- [SMTP y soporte de Brevo](https://github.com/masonjames/emdash-smtp)
- [SMTP en el registro](https://plugins.emdashcms.com/plugins/@masonjames.com/emdash-smtp)
