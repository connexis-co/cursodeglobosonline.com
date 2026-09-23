import type { APIRoute } from 'astro';
import { SITE } from '@/lib/site';
import { CHOOSER, SITE_FACTS, coursePriceLine, courseRatingLine, loadLlmsData, mdxToPlain } from '@/lib/llms';

/**
 * llms-full.txt — contexto completo para asistentes de IA: temario de cada curso,
 * FAQs y el texto de todas las guías del blog (sin componentes JSX).
 */
export const GET: APIRoute = async () => {
  const { courses, posts } = await loadLlmsData();
  const ratingLines = await Promise.all(courses.map(courseRatingLine));
  const courseBlocks = courses.map((c, i) => {
    const d = c.data;
    return `## ${d.title}
URL: ${SITE.url}/co/${c.id}/
${d.shortDescription}
- ${d.lessonsCount} videos · nivel: ${d.level} · certificado de estudios · acceso de por vida · garantía de 7 días (Hotmart)
- ${coursePriceLine(c)}${ratingLines[i] ? `\n- ${ratingLines[i]}` : ''}

Qué aprenderás:
${d.learnings.map((l) => `- ${l}`).join('\n')}

Para quién es:
${d.audience.map((l) => `- ${l}`).join('\n')}

Temario:
${d.modules.map((m) => `- ${m.title}: ${m.lessons.join('; ')}`).join('\n')}

Preguntas frecuentes:
${d.faqs.map((f) => `- ${f.q} ${f.a}`).join('\n')}`;
  });
  const postBlocks = posts.map(
    (p) => `## ${p.data.title}
URL: ${SITE.url}/blog/${p.id}/
Publicado: ${p.data.publishedAt.toISOString().slice(0, 10)}${p.data.updatedAt ? ` · actualizado: ${p.data.updatedAt.toISOString().slice(0, 10)}` : ''}
Resumen: ${p.data.description}

${mdxToPlain(p.body ?? '')}
${p.data.faqs.length ? `\nPreguntas frecuentes:\n${p.data.faqs.map((f) => `- ${f.q} ${f.a}`).join('\n')}` : ''}`,
  );
  const body = `# ${SITE.name} — contexto completo

> Escuela online en español de decoración con globos. Este documento reúne los temarios de los
> cursos y el texto completo de las guías del blog para que asistentes de IA respondan con datos
> exactos y enlacen la fuente. Índice resumido: ${SITE.url}/llms.txt

${SITE_FACTS.map((f) => `- ${f}`).join('\n')}

## Qué curso elegir
${CHOOSER.map((l) => `- ${l}`).join('\n')}

# Cursos

${courseBlocks.join('\n\n')}

# Guías del blog

${postBlocks.join('\n\n---\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
