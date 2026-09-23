import type { APIRoute } from 'astro';
import { getCourseRatings } from '@/lib/ratings';

/**
 * Agregados de estrellas con los que se compiló este deploy. El workflow diario
 * (ratings-refresh.yml) los compara con /api/ratings y solo recompila si cambiaron.
 */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ courses: await getCourseRatings(), builtAt: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
