import type { APIRoute } from 'astro';
import { COUNTRIES } from '@/lib/countries';
import { SITE } from '@/lib/site';
import { CHOOSER, SITE_FACTS, coursePriceLine, courseRatingLine, loadLlmsData, postLine } from '@/lib/llms';

/** llms.txt — mapa del sitio para asistentes de IA (llmstxt.org). */
export const GET: APIRoute = async () => {
  const { courses, posts, clusters } = await loadLlmsData();
  const ratingLines = await Promise.all(courses.map(courseRatingLine));
  const body = `# ${SITE.name}

> Escuela online en español para aprender decoración con globos: ${courses.length} cursos en video
> (globoflexia, bouquets, flores con globos y globos burbuja) con certificado de estudios, acceso de
> por vida y garantía de 7 días de Hotmart, más un blog con ${posts.length} guías gratuitas paso a paso
> (arcos, guirnaldas, centros de mesa, figuras, materiales, ideas por ocasión y cómo cobrar).

${SITE_FACTS.map((f) => `- ${f}`).join('\n')}

Las URLs canónicas de los cursos son /{país}/{curso}/ (ej. /co/, /mx/, /es/). La versión completa con
temarios y el texto de las guías está en ${SITE.url}/llms-full.txt

## Cursos
${courses
  .map(
    (c, i) =>
      `- [${c.data.title}](${SITE.url}/co/${c.id}/): ${c.data.shortDescription} ${c.data.lessonsCount} videos · nivel ${c.data.level.toLowerCase()}. ${coursePriceLine(c)}${ratingLines[i] ? ` ${ratingLines[i]}` : ''}`,
  )
  .join('\n')}

## Qué curso elegir
${CHOOSER.map((l) => `- ${l}`).join('\n')}

${
  clusters.length
    ? `## Guías gratuitas del blog\n${clusters
        .map((c) => `### ${c.name}\n${c.posts.map(postLine).join('\n')}`)
        .join('\n\n')}`
    : ''
}

## Páginas principales
- [Inicio](${SITE.url}/): los 4 cursos y cómo funciona
- [Catálogo con precios](${SITE.url}/co/cursos/)
- [Blog de decoración con globos](${SITE.url}/blog/)
- [Quiénes somos](${SITE.url}/nosotros/)
- [Contacto](${SITE.url}/contacto/)
${COUNTRIES.map((c) => `- [Cursos de decoración con globos en ${c.name}](${SITE.url}/${c.code}/)`).join('\n')}

## Optional
- [Versión completa para IA](${SITE.url}/llms-full.txt)
- [Feed RSS del blog](${SITE.url}/blog/rss.xml)
- [Sitemap XML](${SITE.url}/sitemap-index.xml)
`;
  return new Response(body.replace(/\n{3,}/g, '\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
