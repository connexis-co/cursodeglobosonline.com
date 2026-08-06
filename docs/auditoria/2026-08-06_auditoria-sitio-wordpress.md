# Auditoría técnica — cursodeglobosonline.com (sitio VIVO)

Fecha de auditoría: 2026-08-06. Método: curl con UA Chrome 126 (macOS), solo lectura.
HTMLs crudos y textos extraídos en `crawl/` (pages/, extract/, otros/) dentro de este scratchpad.

---

## 1. Tecnología y tracking

| Ítem | Valor |
|---|---|
| CMS | WordPress 7.0.2 (`<meta name="generator">`) |
| Theme | **Impreza** + child theme `Impreza-child` (UpSolution; las clases `w-btn`, `w-counter`, `w-socials` son de Impreza/UpSolution) |
| Page builders presentes | Elementor 3.27.3, WPBakery Page Builder, Slider Revolution 6.6.7 |
| Plugins detectados | contact-form-7, revslider, table-of-contents-plus, **woocommerce** (cargado pero sin tienda visible), Rank Math SEO (genera sitemaps), Cloudflare (email obfuscation `/cdn-cgi/l/email-protection`) |
| SEO plugin | **Rank Math** (sitemap_index.xml, local-sitemap.xml, locations.kml → módulo Local SEO) |
| GTM | **GTM-KKP7WL8Q** (snippet + noscript iframe) |
| GA4 hardcodeado | **G-WVTB898GPH** (gtag.js directo en el HTML) |
| GA4 dentro del contenedor GTM | **G-PHN6J5MTX6** (etiqueta GA4 configurada en GTM — hay DOS propiedades GA4 disparando) |
| UA / AW / Meta Pixel | No hay UA-, no hay AW- (Google Ads), **no hay Meta Pixel** (ni fbq inline ni fbevents en el contenedor GTM descargado) |
| gtag() | 3 ocurrencias (bootstrap de G-WVTB898GPH) |
| CDN/Proxy | Cloudflare (cdn-cgi presente) |
| Schema JSON-LD (Rank Math) | ImageObject (57), WebSite/WebPage/Person/Organization/Article (28 c/u), VideoObject (2), SearchAction (1). **No hay schema Course ni AggregateRating** |

### robots.txt (verbatim relevante)
- Disallow: /wp-admin/, /wp-login, /tag/, /category/, /categoria-producto/, /author/, /comments/, atajos /en/* (resto de un multiidioma pasado), *?replytocom, /*/attachment/
- Allow: /wp-admin/admin-ajax.php, /*css$, /*.js$
- `Sitemap: https://cursodeglobosonline.com/sitemap_index.xml`

### Sitemaps
- `sitemap_index.xml` → `page-sitemap.xml` (lastmod 2023-11-15) + `local-sitemap.xml` (lastmod 2024-01-17, contiene solo locations.kml).
- `sitemap.xml` y `wp-sitemap.xml` redirigen a `sitemap_index.xml`.
- `locations.kml`: Rank Math Local — nombre "Curso de Globos Online", SIN dirección, SIN teléfono, SIN coordenadas (Placemark vacío). La descripción menciona "globoflexia.com" (texto residual de otra web).

### Redirects de dominio (ya activos en el sitio actual)
- `http://` → 301 → `https://cursodeglobosonline.com/`
- `https://www.` → 301 → `https://cursodeglobosonline.com/` (canónico: https sin www, con trailing slash)

---

## 2. Mapa de URLs (28 páginas HTML + 1 KML; todas 200 OK)

| URL | Status | Title | H1 |
|---|---|---|---|
| / | 200 | 🏅 Cursos de Globos -🎈 Decoración con Globos en Colombia | Las Mejores Decoraciones De Globos para aprender |
| /curso-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional Online | Curso de Globoflexia |
| /curso-bouquets-globos/ | 200 | 🎈 Bouquets de Globos - Curso Profesional 100% Online | Bouquets de globos |
| /curso-flores-con-globos/ | 200 | 🎈 Curso de Flores con Globos 🌻 - Curso Online en México | Flores Con Globos |
| /curso-globos-burbuja/ | 200 | 🎈 Decoración de Globos Burbuja - Curso Profesional Online | globos burbuja |
| /black-friday/ | 200 | Globoflexia Black Friday - Curso de Globos Online | (sin H1) |
| /contacto/ | 200 | Contacto - Curso de Globos Online | Contacto |
| /sitemap/ | 200 | SITEMAP - Curso de Globos Online | SITEMAP |
| /bogota/ | 200 | 🎈 Cursos de Decoración con Globos Bogotá - Programa Online | Los Mejores Cursos De Globos En Bogotá |
| /bogota/curso-de-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional Online en Bogotá | Curso de Globoflexia Bogotá |
| /medellin/ | 200 | 🎈 Cursos de Decoración con Globos - Curso Online Medellín | Los Mejores Cursos De Globos En Medellín |
| /medellin/curso-de-globoflexia/ | 200 | 🥇 Curso de Globoflexia 🎈 - Curso Profesional En Medellín | Curso de Globoflexia Medellín |
| /cali/ | 200 | 🎈 Cursos de Decoración con Globos en Cali - Programa Online | Los Mejores Cursos De Globos En Cali |
| /cali/curso-de-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional Online en Cali | Curso de Globoflexia Cali |
| /barranquilla/ | 200 | 🎈 Cursos de Decoración con Globos - Barranquilla | Los Mejores Cursos De Globos En Barranquilla |
| /barranquilla/curso-de-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional en Barranquilla | Curso de Globoflexia Barranquilla |
| /bucaramanga/ | 200 | 🎈 Cursos de Decoración con Globos - Bucaramanga | Los Mejores Cursos De Globos En Bucaramanga |
| /bucaramanga/curso-de-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional en Bucaramanga | Curso de Globoflexia Bucaramanga |
| /mexico/ | 200 | Los Mejores Cursos de Globos - Decoración con Globos México | Los Mejores Cursos de Decoración de Globos en México |
| /mexico/curso-de-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional Online en México | Curso de Globoflexia en México |
| /mexico/curso-bouquets-globos/ | 200 | 🎈 Bouquets de Globos - Curso Profesional Online en México | Bouquets de globos en México |
| /mexico/curso-flores-con-globos/ | 200 | 🎈 Curso de Flores con Globos 🌻 - Curso Profesional Online | Flores Con Globos en México |
| /mexico/curso-globos-burbuja/ | 200 | 🎈 Curso de Globos Burbuja - Curso Profesional Online México | globos burbuja México |
| /peru/ | 200 | Los Mejores Cursos de Globos - Decoración con Globos en Perú | Los Mejores Cursos de Decoración de Globos en Perú |
| /peru/curso-de-globoflexia/ | 200 | Curso de Globoflexia 🎈 - Curso Profesional Online en Perú | Curso de Globoflexia En Perú |
| /peru/curso-bouquets-globos/ | 200 | 🎈 Bouquets de Globos - Curso Profesional Online en Perú | Bouquets de globos en Perú |
| /peru/curso-flores-con-globos/ | 200 | 🎈 Curso de Flores con Globos 🌻 - Curso Online en Perú | Flores Con Globos Perú |
| /peru/curso-globos-burbuja/ | 200 | 🎈 Curso de Globos Burbuja - Curso Profesional Online Perú | globos burbuja Perú |
| /locations.kml | 200 | (KML Rank Math Local, vacío de datos) | — |

Meta descriptions completas por página: ver `crawl/extract/*.txt`.

H2 de la home: Decoraciones con Globos / ¿Por qué estudiar con nosotros? / Los Mejores Cursos Para ti / Cursos de decoración de globos / Servicios de Decoraciones en globos / Beneficios de las decoraciones con globos / Galería / Contáctanos ahora Somos la mejor Opción.

H2 típicos de página de curso (globoflexia): Globoflexia Figuras con Globos / Curso de Globoflexia / ¿Qué aprenderás…? / Temario del curso / Obtenga un certificado de estudios / Preguntas Frecuentes / ¡Hazte un Experto…!

---

## 3. Enlaces Hotmart (VERBATIM, tal como están en el HTML)

El sitio usa el acortador oficial de Hotmart `hotm.art` (NO aparece "hotmart.com" literal en el HTML). CTA típico: `<a class="w-btn us-btn-style_3" href="https://hotm.art/..." target="_blank" rel="noopener"><span class="w-btn-label">Compra Ahora Tu Curso</span></a>`.

| Página origen | URL Hotmart verbatim en el HTML |
|---|---|
| /curso-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /bogota/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /medellin/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /cali/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /barranquilla/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /bucaramanga/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /mexico/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /peru/curso-de-globoflexia/ | https://hotm.art/curso-globoflexia-crashing |
| /black-friday/ | https://hotm.art/curso-globoflexia-crashing?offDiscount=031016 |
| /curso-bouquets-globos/ | https://hotm.art/curso-bouquet-globos-crashing |
| /mexico/curso-bouquets-globos/ | https://hotm.art/curso-bouquet-globos-crashing |
| /peru/curso-bouquets-globos/ | https://hotm.art/curso-bouquet-globos-crashing |
| /curso-flores-con-globos/ | https://hotm.art/curso-flores-con-globos-crashing |
| /mexico/curso-flores-con-globos/ | https://hotm.art/curso-flores-con-globos-crashing |
| /peru/curso-flores-con-globos/ | https://hotm.art/curso-flores-con-globos-crashing |
| /curso-globos-burbuja/ | https://hotm.art/curso-globo-burbuja-crashing y https://hotm.art/curso-bouquet-globos-crashing (la página tiene AMBOS) |
| /mexico/curso-globos-burbuja/ | https://hotm.art/curso-globo-burbuja-crashing y https://hotm.art/curso-bouquet-globos-crashing |
| /peru/curso-globos-burbuja/ | https://hotm.art/curso-globo-burbuja-crashing y https://hotm.art/curso-bouquet-globos-crashing |

NOTA/BUG: las 3 páginas de globos-burbuja mezclan el CTA correcto (curso-globo-burbuja-crashing) con el del bouquet (curso-bouquet-globos-crashing) — hay botones que venden el producto equivocado.

Las páginas de ciudad "hub" (/bogota/, /medellin/, /cali/, /barranquilla/, /bucaramanga/, /mexico/, /peru/, home, /contacto/, /sitemap/) NO tienen enlaces Hotmart.

### Resolución de cada hotm.art (cadena de redirects, capturada en vivo)

| hotm.art | 302 → go.hotmart.com (hotlink afiliado) | Destino final pay.hotmart.com |
|---|---|---|
| /curso-globoflexia-crashing | https://go.hotmart.com/X76953266Q?ap=7766 | https://pay.hotmart.com/M47265375C?ref=X76953266Q |
| /curso-globoflexia-crashing?offDiscount=031016 | https://go.hotmart.com/X76953266Q?ap=7766&offDiscount=031016 | https://pay.hotmart.com/M47265375C?ref=X76953266Q&offDiscount=031016 |
| /curso-bouquet-globos-crashing | https://go.hotmart.com/Y76953276W?ap=e8ab | https://pay.hotmart.com/G56852236M?ref=Y76953276W |
| /curso-flores-con-globos-crashing | https://go.hotmart.com/T76953268Y?ap=3983 | https://pay.hotmart.com/U68605508W?ref=T76953268Y |
| /curso-globo-burbuja-crashing | https://go.hotmart.com/D76953272A?ap=e031 | https://pay.hotmart.com/F62444331S?ref=D76953272A |

- IDs de producto Hotmart (checkout): M47265375C (globoflexia), G56852236M (bouquets), U68605508W (flores), F62444331S (burbuja).
- IDs de afiliado (ref/hotlink): X76953266Q, Y76953276W, T76953268Y, D76953272A (con `ap=` distinto por link).
- No hay enlaces a seminariosonline.com en cursodeglobosonline.com. (En academiadebelleza.edu.co los hotm.art llevan sufijo `-SO` = Seminarios Online.)

---

## 4. Códigos de descuento encontrados

| Código / mecanismo | % | Fuente exacta |
|---|---|---|
| **SABLY40** (cupón textual, "se aplica automáticamente al inscribirte desde Sably") | 40% | sably.co/co/ (home). Texto: "Oferta por tiempo limitado — 40% de descuento con el cupón SABLY40" + bloque "Explorar cursos con 40% OFF"; todas las cards muestran -40% (ej. $196.000 ← $328.000 COP) |
| **offDiscount=031016** (parámetro Hotmart, no es cupón textual) | 50% | cursodeglobosonline.com/black-friday/ → hotm.art/curso-globoflexia-crashing?offDiscount=031016. Texto de la página: "50% de descuento… ¡APROVECHA HOY EL 50% DTO.! Antes $50 dólares Ahora $25 dólares" |
| (sin código textual; promo aplicada al precio) | 50% | academiadebelleza.edu.co/cursos-belleza/unas/curso-de-unas-acrilicas/ — "promoción especial con un 50% de descuento": $169.000 → $84.500 COP. Igual en curso-de-masajes ($169.000 → $84.500) |
| (sin código textual; promo aplicada al precio) | 25% | academiadebelleza.edu.co/cursos-belleza/maquillaje/curso-de-maquillaje/ — $338.200 → $253.650 COP |
| Formulario CF7 de ADB con select "Curso de interés": opciones "25% de descuento" / "50% de descuento" | 25/50% | Presente en las 3 páginas de curso auditadas de academiadebelleza.edu.co |

En cursodeglobosonline.com NO existe ningún cupón alfanumérico visible (tipo GLOBOS50); el único descuento es la landing /black-friday/ vía parámetro offDiscount de Hotmart.

---

## 5. Inventario de cursos (4 cursos + página genérica; el contador de la home dice "5 Cursos Para Ti")

Precios: NO hay precios visibles en las páginas normales de curso. El único precio publicado está en /black-friday/: **Antes $50 dólares → Ahora $25 dólares (USD)** para Globoflexia. Los precios reales viven en el checkout de Hotmart.

### 5.1 Curso de Globoflexia
- URL: /curso-globoflexia/ (+ variantes bogota/medellin/cali/barranquilla/bucaramanga/mexico/peru)
- Checkout: pay.hotmart.com/M47265375C (vía hotm.art/curso-globoflexia-crashing)
- Imagen destacada (og:image): https://cursodeglobosonline.com/wp-content/uploads/2022/12/curso-de-globoflexia.jpg
- Descripción corta (meta): "¡Aprende a hacer figuras con globos! con el Curso de globoflexia. Inscríbete ahora y conviértete en un experto en globoflexia. ¡Entra Ahora!"
- Temario (23 vídeos, verbatim): V1 Antes de comenzar · V2 Globoflexia básica nudos · V3 Cómo retorcer · V4 Animales Perrito simple · V5 Perro Lulú · V6 Flor simple · V7 Flor compleja · V8 Tórtolas enamoradas · V9 La espada · V10 Roturas · V11 La orejita · V12 El avión · V13 La flor minimalista · V14 Gorro de bufón · V15 Palmera y mono · V16 Cangrejo · V17 Pantera rosa · V18 Espada pirata · V19 Gato · V20 Correcaminos · V21 Despedida · BONOS: V22 Porta globos · V23 Hinchador eléctrico
- Extras: Certificado de Estudios ("validez internacional", tareas calificadas, asistencia académica). Instructor (en /black-friday/): **Juan Manuel Marcos**, +25 años de experiencia en globoflexia en España, campañas promocionales y animaciones para marcas de bebidas.

### 5.2 Curso Bouquets de Globos
- URL: /curso-bouquets-globos/ (+ mexico, peru)
- Checkout: pay.hotmart.com/G56852236M (vía hotm.art/curso-bouquet-globos-crashing)
- Imagen: https://cursodeglobosonline.com/wp-content/uploads/2022/12/curso-de-bouquets-de-globos.jpg
- Descripción corta: "Inscríbete ahora en este Curso de Educación Profesional de Decoración con Globos - Bouquets de Globos y ¡lleva tu negocio al siguiente nivel!"
- Temario (17 vídeos): V1 Presentación · V2 Introducción · V3 Historia · V4 Tendencias · V5 Materiales · V6 Inflado y calibrado · V7–V12 Elaboración partes 1–6 · V13 Conclusiones presupuesto · V14–V17 Bono bouquet desayuno sorpresa partes 1–4
- Extras: Constancia de Estudios. Claim "100% Online".

### 5.3 Curso de Flores con Globos
- URL: /curso-flores-con-globos/ (+ mexico, peru)
- Checkout: pay.hotmart.com/U68605508W (vía hotm.art/curso-flores-con-globos-crashing)
- Imagen: https://cursodeglobosonline.com/wp-content/uploads/2022/12/curso-de-decoraciones-de-flores-con-globos.jpg
- Descripción corta: "Inscríbete ahora en este Curso de Educación Profesional de Decoración con Globos - Flores con Globos y ¡lleva tu negocio al siguiente nivel!"
- Temario (5 módulos): M1 Teoría (Bienvenida, Introducción, Soporte técnico, Materiales y herramientas, Recomendaciones de marcas) · M2 Práctica (Flor 5 pétalos globo redondo, Botón de rosa, Flor 8 pétalos globo 260, Flor orquídea, Técnica base flor distorsión, Flor 8 pétalos con r5, Flor distorsión 1, Flor roja/negro globo corazón, Flor de cayena, Flor distorsión dorada/blanco, Hojas 1-2, Cubrir estructuras, Tips estructura, Bouquet cayena, Flor nudo interno, Números para rellenar 1-2, Bouquet margaritas, Violeta, Centro con Telgopor, Centro con CD, Flor doble) · M3 Bonos (Drive 150 ideas, material números) · M4 Video respuestas · M5 Cómo obtener certificado

### 5.4 Curso de Globos Burbuja
- URL: /curso-globos-burbuja/ (+ mexico, peru)
- Checkout: pay.hotmart.com/F62444331S (vía hotm.art/curso-globo-burbuja-crashing) — OJO: la página también contiene botones al checkout del Bouquet
- Imagen: https://cursodeglobosonline.com/wp-content/uploads/2022/12/curso-de-globos-burbuja.jpg
- Descripción corta: "Inscríbete ahora en este Curso de Educación Profesional de Decoración con Globos - Globos Burbuja y ¡lleva tu negocio al siguiente nivel!"
- Temario (10 módulos): M1 Introducción (presentación, tipos de globos burbuja) · M2 Técnica confeti · M3 Tassels (técnicas 1-2, contrapeso, aplicación) · M4 Técnica mármol (2 partes) · M5 Degradado con brillantina · M6 Técnica rayas · M7 Globo boy or girl · M8 Globo unicornio (3 partes) · M9 BONOS (bouquet variado, bouquet número chico, despedida) · M10 Video respuestas

### Social proof numérico (home, contadores animados Impreza)
- 5 Cursos Para Ti · +50 Videos de Apoyo · +100 Estudiantes Certificados · +80 Emprendimientos Creados
- No hay ratings/estrellas ni AggregateRating en schema. Público objetivo declarado: "Emprendedores, amas de casa, Recién graduados, Magos, Animadores, Estudiantes".
- Imagen del instructor (og:image de /black-friday/): https://cursodeglobosonline.com/wp-content/uploads/2023/11/instructor-juan-manuel-marcos.jpg

---

## 6. Contacto y social

- **Email:** contacto@cursodeglobosonline.com (ofuscado con Cloudflare data-cfemail; decodificado).
- **WhatsApp:** NO hay wa.me ni api.whatsapp.com en ninguna página.
- **Teléfono:** ninguno real; en /contacto/ aparece el placeholder "321 123 4567". El KML local no tiene teléfono ni dirección.
- **Redes sociales:** iconos Facebook, Instagram y Twitter en el footer con `href="#"` (NO enlazan a ningún perfil).
- **Formulario:** Contact Form 7 en /contacto/ con labels EN INGLÉS: Name(*), Last Name(*), Email(*), Phone(*), "Write us your inquiry".
- Footer: "© 2022 Todos los derechos reservados – Desarrollado por" → logo enlazado a https://innovamos.co/ (la imagen del logo se sirve desde newcorporationdrywall.com — hotlink externo raro).
- Footer masivo de enlaces salientes a la red de sitios del mismo dueño (javiermisat.com, innovamos.co, skynails.co, academiadebelleza.co, desayunossorpresa.net, becasicetex.com, inmobiliariabogota.net, banosportatiles.net, cursosdeconduccion.co, ciudadperdidacolombia.com, etc. — ~40 dominios).

---

## 7. Testimonios

- cursodeglobosonline.com: **NO hay testimonios con nombre** en ninguna de las 28 páginas (no existe sección de testimonios).
- sably.co (referencia): sí tiene testimonios con nombre — "Carolina S., Bogotá" (costura) y "Óscar D., Cartagena" (coctelería) — y claims "⭐ 4.8/5 · 15.000+ estudiantes en 8 países".

---

## 8. Sitios de la misma red auditados (paso 9)

### academiadebelleza.edu.co
- Title home: "Academia de Belleza Online | Cursos Certificados desde $84.500".
- Sin cupones alfanuméricos. Descuentos como precio tachado: 50% en cursos de $169.000 → $84.500 COP (uñas acrílicas, masajes); 25% en maquillaje $338.200 → $253.650 COP.
- Formulario con select "25% de descuento / 50% de descuento".
- Checkouts vía hotm.art con sufijo `-SO` (Seminarios Online): hotm.art/maquillaje-fantasia-como-negocio-curso-venta-SO, hotm.art/maquillaje-permanente-curso-venta-SO, hotm.art/masaje-descontracturante-curso-venta-SO.
- Stats home: "40% de nuestros estudiantes iniciaron su propio emprendimiento", "50%…".

### sably.co (→ sirve /co/)
- Title: "Cursos Online de Oficios y Habilidades Prácticas en Colombia | Sably".
- **Cupón: SABLY40 = 40% de descuento** — "Oferta por tiempo limitado. 40% de descuento con el cupón SABLY40. El cupón se aplica automáticamente al inscribirte desde Sably" + contador regresivo.
- Precios ejemplo (COP, tachado = sin dcto): Uñas $196.000←$328.000 · Pastelería $236.000←$392.000 · Cocina $156.000←$260.000 · Barbería $128.000←$212.000 · Peluquería $116.000←$192.000 · Marketing Digital $140.000←$232.000 · Inglés $140.000←$232.000.
- Garantía 7 días, devolución 100%.

---

## 9. Observaciones para la migración (301s y notas)

URLs que DEBEN mantenerse o redirigir 301 en el sitio nuevo (las 28 del mapa, prioridad por tipo):
1. **Money pages** (tienen CTA Hotmart): /curso-globoflexia/, /curso-bouquets-globos/, /curso-flores-con-globos/, /curso-globos-burbuja/, /black-friday/, y las 11 variantes geo con CTA (/[ciudad]/curso-de-globoflexia/ ×5, /mexico|peru/curso-* ×8).
2. **Hubs geo**: /bogota/, /medellin/, /cali/, /barranquilla/, /bucaramanga/, /mexico/, /peru/.
3. **Utilitarias**: /contacto/, /sitemap/ (sitemap HTML; puede 301 a la home o recrearse).
4. Conservar patrón de dominio: https sin www con trailing slash (301 http y www ya existen).
5. Mantener/regenerar: robots.txt con referencia al sitemap nuevo; sitemap XML. El local-sitemap/locations.kml de Rank Math está vacío de datos (sin NAP) — se puede descartar sin pérdida si no se usa Local SEO.
6. Feeds y misceláneos WP que dejarán de existir: /feed/, /comments/feed/, /xmlrpc.php — devolver 410 o 301 a home.
7. Tracking a migrar: GTM-KKP7WL8Q + GA4 G-WVTB898GPH (hardcoded) y G-PHN6J5MTX6 (vía GTM). Decidir si se consolidan las dos propiedades GA4. No hay Meta Pixel que migrar.
8. Enlaces Hotmart a replicar EXACTOS (hotm.art conserva el hotlink de afiliado ref=X76953266Q etc.). Corregir el bug de /curso-globos-burbuja/* que mezcla el checkout del bouquet.
9. Los títulos usan emojis (🏅🎈🌻🥇) — decisión consciente de SERP CTR; replicar o no según criterio.
10. El footer actual tiene ~40 enlaces salientes de red (footer links cross-site). Decidir si se conservan (riesgo SEO de link scheme) — la migración es buena oportunidad para podarlos.
11. Página /curso-flores-con-globos/ tiene title "…Curso Online en México" pese a ser la genérica — inconsistencia a corregir.
12. No hay hreflang entre las variantes Colombia/México/Perú (contenido casi duplicado por país) — considerar hreflang es-CO/es-MX/es-PE o canonicals en el sitio nuevo.
