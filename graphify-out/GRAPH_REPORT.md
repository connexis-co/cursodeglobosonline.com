# Graph Report - /Users/jpmisat/Documents/JP Projects/cursodeblogosonline.com  (2026-08-06)

## Corpus Check
- 81 files · ~52,444 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 331 nodes · 678 edges · 21 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.83)
- Token cost: 28,200 input · 18,600 output

## Community Hubs (Navigation)
- Gobernanza, auditoría y decisiones
- Dependencias Astro/Tailwind
- package.json y overrides
- Header, Footer y navegación
- Componentes de página de curso
- SEO, layouts y schema
- Tooling de calidad (lint/commit)
- Globos animados y ciudades
- Configuración TypeScript
- Checkout Hotmart y landings Ads
- Sitemaps segmentados
- Taxonomía de categorías
- Estudio SEO y keywords
- FAQ y GeoToast interactivos
- Commitlint
- Marca e imágenes OG
- Content collections
- Portadas ilustradas SVG
- Instructor y disciplina globoflexia

## God Nodes (most connected - your core abstractions)
1. `Auditoría técnica del sitio WordPress vivo` - 26 edges
2. `Plan de reconstrucción frontend` - 22 edges
3. `COUNTRIES` - 20 edges
4. `CHANGELOG (v0.1.0)` - 18 edges
5. `README del repo cursodeglobosonline.com` - 17 edges
6. `SITE` - 16 edges
7. `Roadmap del proyecto` - 16 edges
8. `overrides` - 12 edges
9. `Referencias de diseño (LBD, ADB, aprende, sably)` - 11 edges
10. `Curso de Globoflexia` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Landings de Ads /landing/ (noindex)` --semantically_similar_to--> `/black-friday/ (landing WordPress)`  [INFERRED] [semantically similar]
  README.md → docs/auditoria/2026-08-06_auditoria-sitio-wordpress.md
- `Curso de Globoflexia` --shares_data_with--> `M47265375C (checkout Hotmart Globoflexia)`  [INFERRED]
  src/content/courses/curso-de-globoflexia.mdx → docs/auditoria/2026-08-06_auditoria-sitio-wordpress.md
- `Curso de Bouquets de Globos` --shares_data_with--> `G56852236M (checkout Hotmart Bouquets)`  [INFERRED]
  src/content/courses/curso-de-bouquets-de-globos.mdx → docs/auditoria/2026-08-06_auditoria-sitio-wordpress.md
- `Curso de Flores con Globos` --shares_data_with--> `U68605508W (checkout Hotmart Flores)`  [INFERRED]
  src/content/courses/curso-de-flores-con-globos.mdx → docs/auditoria/2026-08-06_auditoria-sitio-wordpress.md
- `Curso de Globos Burbuja` --shares_data_with--> `F62444331S (checkout Hotmart Globos Burbuja)`  [INFERRED]
  src/content/courses/curso-de-globos-burbuja.mdx → docs/auditoria/2026-08-06_auditoria-sitio-wordpress.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Catálogo de 4 cursos reales Hotmart** — src_content_courses_curso_de_globoflexia, src_content_courses_curso_de_bouquets_de_globos, src_content_courses_curso_de_flores_con_globos, src_content_courses_curso_de_globos_burbuja [EXTRACTED 1.00]
- **Ecosistema Sably (hub + filiales)** — readme_sably, readme_cursodeglobosonline_com, readme_academiadebelleza [EXTRACTED 1.00]
- **Pipeline CI/CD GitHub Actions → Cloudflare Pages** — github_workflows_ci, github_workflows_deploy_staging, github_workflows_deploy_production, readme_cloudflare_pages, github_workflows_deploy_production_release_please [EXTRACTED 1.00]

## Communities (21 total, 0 thin omitted)

### Community 0 - "Gobernanza, auditoría y decisiones"
Cohesion: 0.07
Nodes (73): CHANGELOG (v0.1.0), Guía de contribución, Conventional Commits, Git Flow (main/develop/feature), Auditoría técnica del sitio WordPress vivo, /black-friday/ (landing WordPress), Bug CTA Globos Burbuja → checkout Bouquets, Enlaces Hotmart hotm.art *-crashing (hotlink de afiliado) (+65 more)

### Community 1 - "Dependencias Astro/Tailwind"
Cohesion: 0.07
Nodes (27): astro, @astrojs/mdx, @astrojs/react, @fontsource-variable/fraunces, @fontsource-variable/nunito-sans, lucide-react, nanostores, @nanostores/persistent (+19 more)

### Community 2 - "package.json y overrides"
Cohesion: 0.08
Nodes (24): name, overrides, cache-manager, cacheable, @cacheable/memory, @cacheable/net, @cacheable/node-cache, cacheable-request (+16 more)

### Community 3 - "Header, Footer y navegación"
Cohesion: 0.16
Nodes (13): string, header, CITIES_ENABLED, COUNTRIES, Country, DEFAULT_COUNTRY, formatPrice(), getCountry() (+5 more)

### Community 4 - "Componentes de página de curso"
Cohesion: 0.18
Nodes (9): stars, AVATAR_COLORS, city, country, countryAlternates(), faqSchema(), courses, faqs (+1 more)

### Community 5 - "SEO, layouts y schema"
Cohesion: 0.19
Nodes (12): BreadcrumbItem, courseSchema(), CourseSchemaInput, FaqEntry, HreflangAlternate, organizationSchema(), CDN_URL, GA4_ID (+4 more)

### Community 6 - "Tooling de calidad (lint/commit)"
Cohesion: 0.12
Nodes (17): @astrojs/check, @commitlint/cli, @commitlint/config-conventional, husky, devDependencies, @astrojs/check, @commitlint/cli, @commitlint/config-conventional (+9 more)

### Community 7 - "Globos animados y ciudades"
Cohesion: 0.13
Nodes (10): PALETA, cityLocal, courses, faqs, testimonials, CITY_LOCAL, CityLocal, getCityLocal() (+2 more)

### Community 8 - "Configuración TypeScript"
Cohesion: 0.14
Nodes (13): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, node_modules, compilerOptions, baseUrl, jsx (+5 more)

### Community 9 - "Checkout Hotmart y landings Ads"
Cohesion: 0.18
Nodes (6): href, buildHotmartUrl(), buildWhatsAppUrl(), HotmartUrlParams, country, waUrl

### Community 10 - "Sitemaps segmentados"
Cohesion: 0.33
Nodes (9): blogUrls(), categoriasUrls(), cursosUrls(), pagesUrls(), renderUrlset(), SITEMAP_NAMES, u(), UrlEntry (+1 more)

### Community 11 - "Taxonomía de categorías"
Cohesion: 0.21
Nodes (8): CATEGORIES, Category, getCategory(), Subcategory, breadcrumbSchema(), activeCategories, courses, activeCategories

### Community 12 - "Estudio SEO y keywords"
Cohesion: 0.31
Nodes (10): Cluster de blog 'como hacer arcos de globos', Estudio de keywords Ubersuggest, balloonsbyluzpaz.com (Luz Paz Academy), como hacer arcos de globos (keyword), curso de decoración con globos (keyword), curso de globoflexia (keyword), decoración con globos (keyword), superglobos.com (+2 more)

### Community 13 - "FAQ y GeoToast interactivos"
Cohesion: 0.20
Nodes (7): string, toast, if(), EventParams, META_MAP, trackEvent(), Window

### Community 14 - "Commitlint"
Cohesion: 0.25
Nodes (8): extends, rules, subject-case, subject-max-length, type-enum, always, @commitlint/config-conventional, never

### Community 15 - "Marca e imágenes OG"
Cohesion: 0.36
Nodes (8): Brand identity of cursodeglobosonline.com: balloon motif with coral-led warm palette, Brand color palette: coral, aqua, cream and gold, Home page decoration showcase of cursodeglobosonline.com, Social sharing / Open Graph link previews for cursodeglobosonline.com, Organic balloon garland (guirnalda organica) decoration technique, Favicon SVG: brand balloon icon - a single coral balloon with radial gradient (#f8a99a -> #e2543b), white gloss highlight, knot triangle and curly muted-purple string (#8a4a63); the site's brand mark shown in browser tabs, Photograph of a real organic balloon garland (guirnalda organica) in terracotta/coral, cream and chrome-gold balloons with eucalyptus greenery, baby's breath and gold ribbon streamers, cascading down a sunlit wall beside a window; showcase image used on the home page, Default Open Graph social-sharing image: 3D-rendered organic balloon arch curving down the right side in the brand palette (coral, aqua, cream, metallic gold) on a cream background, with empty left space for text overlay in link previews

### Community 16 - "Content collections"
Cohesion: 0.33
Nodes (5): blog, categorySlugs, collections, courses, testimonials

### Community 17 - "Portadas ilustradas SVG"
Cohesion: 0.50
Nodes (4): CONFETI, confetti(), garland, rand()

### Community 18 - "Instructor y disciplina globoflexia"
Cohesion: 0.50
Nodes (4): Course pages of cursodeglobosonline.com (balloon-decoration courses), Globoflexia (balloon twisting and decoration discipline taught by the site), Juan Manuel Marcos - globoflexia instructor of cursodeglobosonline.com, Instructor photo: portrait of Juan Manuel Marcos, a real person - smiling man with mustache and goatee wearing a purple hoodie against a periwinkle-blue cutout background; headshot used on course pages as the globoflexia instructor

## Ambiguous Edges - Review These
- `G-PHN6J5MTX6 (GA4 vía GTM)` → `Proyecto Ubersuggest 78195c4e (cursodeglobosonline.com)`  [AMBIGUOUS]
  docs/seo/2026-08-06_proyecto-ubersuggest.md · relation: shares_data_with

## Knowledge Gaps
- **108 isolated node(s):** `@commitlint/config-conventional`, `never`, `name`, `type`, `version` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `G-PHN6J5MTX6 (GA4 vía GTM)` and `Proyecto Ubersuggest 78195c4e (cursodeglobosonline.com)`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._
- **Why does `dependencies` connect `Dependencias Astro/Tailwind` to `package.json y overrides`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Tooling de calidad (lint/commit)` to `package.json y overrides`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Roadmap del proyecto` connect `Gobernanza, auditoría y decisiones` to `Estudio SEO y keywords`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `@commitlint/config-conventional`, `never`, `name` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Gobernanza, auditoría y decisiones` be split into smaller, more focused modules?**
  _Cohesion score 0.06887366818873668 - nodes in this community are weakly interconnected._
- **Should `Dependencias Astro/Tailwind` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._