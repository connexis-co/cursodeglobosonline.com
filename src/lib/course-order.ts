/**
 * Orden editorial único del catálogo. Antes cada página ordenaba solo por `featured` y el resto
 * salía en el orden interno del CMS, distinto en cada entorno. El curso general de decoración va
 * primero entre los no destacados: es la respuesta a «curso de globos» y «curso de decoración
 * con globos», y de él cuelgan las especialidades.
 */
const ORDER = [
  'curso-de-decoracion-con-globos',
  'curso-de-globoflexia',
  'curso-de-bouquets-de-globos',
  'curso-de-flores-con-globos',
  'curso-de-globos-burbuja',
];
const rank = (id: string) => {
  const index = ORDER.indexOf(id);
  return index === -1 ? ORDER.length : index;
};

/** Destacado primero (tarjeta grande); después, el orden editorial. No muta el arreglo recibido. */
export function sortCourses<T extends { id: string; data: { featured?: boolean } }>(courses: T[]): T[] {
  return [...courses].sort(
    (a, b) => Number(b.data.featured ?? false) - Number(a.data.featured ?? false) || rank(a.id) - rank(b.id),
  );
}

/** Slug del curso general: destino de los enlaces «curso de decoración con globos». */
export const GENERAL_COURSE = 'curso-de-decoracion-con-globos';
