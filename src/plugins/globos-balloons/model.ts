/**
 * Opciones de la bandada de globos (BalloonFlock.astro), editables en el panel:
 * Plugins → «Curso de Globos · Globos». Este archivo no depende de EmDash: lo usan el plugin,
 * su pantalla de administración y las pruebas.
 */
export interface BalloonSettings {
  /** Apaga o enciende todos los globos de página. */
  enabled: boolean;
  /** Cuántos globos en pantallas anchas (0–5). */
  count: number;
  /** Cuántos en móvil y tablet (0–3). */
  countMobile: number;
  /** Tamaño, en porcentaje del diseño (60–140). */
  size: number;
  /** Dibujar la cuerda. */
  strings: boolean;
  /** Qué cuelga del nudo: una cuerda fina y recta, o una serpentina rizada del color del globo. */
  stringStyle: 'cuerda' | 'serpentina';
  /** Reaccionar al cursor: empujar, agarrar, arrastrar y lanzar. */
  interactive: boolean;
  /** Reventar con doble clic (y que suba uno nuevo). */
  pop: boolean;
  /** Mostrarlos también en los artículos del blog. */
  articles: boolean;
}

export const DEFAULT_SETTINGS: BalloonSettings = {
  enabled: true,
  count: 5,
  countMobile: 3,
  size: 100,
  strings: true,
  stringStyle: 'cuerda',
  interactive: true,
  pop: true,
  articles: false,
};

export const LIMITS = { count: 5, countMobile: 3, sizeMin: 60, sizeMax: 140 } as const;

function integer(input: unknown, name: string, min: number, max: number): number {
  if (typeof input !== 'number' || !Number.isInteger(input) || input < min || input > max) {
    throw new Error(`${name}: número entero entre ${min} y ${max}.`);
  }
  return input;
}
function flag(input: unknown, name: string): boolean {
  if (typeof input !== 'boolean') throw new Error(`${name}: debe ser sí o no.`);
  return input;
}

/** Valida lo que llega del panel. Lanza un error legible si algo no cuadra. */
export function validateSettings(input: unknown): BalloonSettings {
  if (!input || typeof input !== 'object') throw new Error('Configuración de globos no válida.');
  const v = input as Record<string, unknown>;
  return {
    enabled: flag(v.enabled, 'Mostrar globos'),
    count: integer(v.count, 'Cantidad en escritorio', 0, LIMITS.count),
    countMobile: integer(v.countMobile, 'Cantidad en móvil', 0, LIMITS.countMobile),
    size: integer(v.size, 'Tamaño', LIMITS.sizeMin, LIMITS.sizeMax),
    strings: flag(v.strings, 'Cuerdas'),
    stringStyle: v.stringStyle === 'serpentina' ? 'serpentina' : v.stringStyle === 'cuerda' || v.stringStyle === undefined ? 'cuerda' : (() => { throw new Error('Tipo de cuerda: debe ser «cuerda» o «serpentina».'); })(),
    interactive: flag(v.interactive, 'Interacción'),
    pop: flag(v.pop, 'Reventar'),
    articles: flag(v.articles, 'Artículos'),
  };
}
