import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { COUNTRIES } from '@/lib/countries';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/site';

/** llms.txt — descripción del sitio para agentes/LLMs (llmstxt.org). */
export const GET: APIRoute = async () => {
  const courses = await getCollection('courses');
  const body = `# ${SITE.name}

> Cursos online en español de decoración con globos: globoflexia, bouquets, flores y globos
> burbuja. ${courses.length} cursos con certificado de estudios y acceso de por vida, impartidos
> vía Hotmart. Parte del ecosistema Sably (https://sably.co). Precios en moneda local de
> ${COUNTRIES.length} países.

Los cursos existen a nivel país (/{código-país}/{slug-del-curso}/). Países: ${COUNTRIES.map((c) => c.code).join(', ')}.

## Cursos
${courses.map((c) => `- [${c.data.title}](${SITE.url}/co/${c.id}/): ${c.data.shortDescription}`).join('\n')}

## Categorías
${CATEGORIES.map((c) => `- [${c.name}](${SITE.url}/co/cursos/${c.slug}/): ${c.short}`).join('\n')}

## Páginas principales
- [Catálogo completo](${SITE.url}/co/cursos/)
- [Sobre nosotros](${SITE.url}/nosotros/)
- [Blog](${SITE.url}/blog/)
- [Mapa del sitio](${SITE.url}/sitemap/)

## Optional
- [Sitemap XML](${SITE.url}/sitemap-index.xml)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
