/** Exact normalized matches are an editorial guard, not proof of semantic cannibalization. */
export function normalizeKeyword(value: unknown): string {
  return String(value ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function blogSeoError(data: Record<string, unknown>): string | undefined {
  if (!normalizeKeyword(data.primary_keyword)) return 'Indica la búsqueda principal que resolverá este artículo antes de publicarlo.';
  if (/^cursos?\b/.test(normalizeKeyword(data.primary_keyword))) return 'La búsqueda de un curso pertenece a su ficha comercial. Elige una intención informativa para el artículo.';
  if (Array.isArray(data.body) && data.body.some(b => b && typeof b === 'object' && b._type === 'block' && b.style === 'h1')) {
    return 'El título del artículo ya es el H1. Usa H2 o H3 dentro del contenido.';
  }
}

export function duplicateKeyword(data: Record<string, unknown>, candidate: Record<string, unknown>): boolean {
  const keyword = normalizeKeyword(data.primary_keyword);
  return Boolean(keyword) && keyword === normalizeKeyword(candidate.primary_keyword);
}
