/** The sitemap lists indexable originals, never SEO-panel exclusions or duplicates. */
export function isSitemapEligible(seo: unknown, path: string, siteUrl: string): boolean {
  if (!seo || typeof seo !== 'object') return true;
  const value = seo as {noIndex?: boolean; canonical?: string | null};
  if (value.noIndex) return false;
  if (!value.canonical) return true;
  try {
    const canonical = new URL(value.canonical, siteUrl);
    const own = new URL(path, siteUrl);
    canonical.hash = ''; own.hash = '';
    return canonical.href === own.href;
  } catch { return false; }
}
