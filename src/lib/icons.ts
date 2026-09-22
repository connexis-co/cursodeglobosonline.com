/**
 * Iconografía propia de cursodeglobosonline.com (sustituye a los emojis como iconos).
 *
 * Reglas de dibujo, comunes a todos:
 *  · lienzo 24×24, solo trazo (`fill="none"`, `stroke="currentColor"`), grosor 1.8,
 *    extremos y uniones redondeados → se ven "a mano", no de librería.
 *  · cada icono es una lista de `d` de <path> (círculos y rectángulos incluidos como arcos),
 *    así `Icon.astro` los pinta con un único bucle y sin `set:html`.
 *  · un punto se dibuja como subtrazo de longitud ~0 (`h.01`): con `linecap round` sale un
 *    círculo del grosor del trazo.
 *  · `globo` reutiliza la anatomía de `Balloons.astro`: cuerpo en lágrima, brillo arriba a la
 *    izquierda, nudo y cuerda en S.
 */
export const ICONS = {
  /** Video / lección grabada (sustituye 📹 🎥). */
  play: [
    'M6.5 5h11A3.5 3.5 0 0 1 21 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 15.5v-7A3.5 3.5 0 0 1 6.5 5Z',
    'M10.5 9.2v5.6l4.6-2.8-4.6-2.8Z',
  ],
  /** Certificado (sustituye 🎓): birrete con borla. */
  birrete: [
    'M12 4.5 2.5 9 12 13.5 21.5 9 12 4.5Z',
    'M6.5 11.2v4.4c0 1.5 2.5 2.9 5.5 2.9s5.5-1.4 5.5-2.9v-4.4',
    'M21.5 9v5.3',
    'M21.5 14.3l-.9 2.2h1.8l-.9-2.2Z',
  ],
  /** Cualquier dispositivo (sustituye 📱): portátil + celular. */
  dispositivo: [
    'M13 15.5H3.5V6.5A1.5 1.5 0 0 1 5 5h11a1.5 1.5 0 0 1 1.5 1.5v2',
    'M3.5 15.5 2 18.5h11.5',
    'M16.9 9.5h3.7a1.4 1.4 0 0 1 1.4 1.4v7.7a1.4 1.4 0 0 1-1.4 1.4h-3.7a1.4 1.4 0 0 1-1.4-1.4v-7.7a1.4 1.4 0 0 1 1.4-1.4Z',
    'M18.75 17.3h.01',
  ],
  /** Acceso de por vida (sustituye ♾️). */
  infinito: [
    'M12 12c-1.6-2.3-3.2-4-5.2-4a4 4 0 0 0 0 8c2 0 3.6-1.7 5.2-4Z',
    'M12 12c1.6 2.3 3.2 4 5.2 4a4 4 0 0 0 0-8c-2 0-3.6 1.7-5.2 4Z',
  ],
  /** Garantía (sustituye 🛡️): escudo con visto. */
  escudo: [
    'M12 3 5 5.8v5.5c0 4.3 2.9 8 7 9.7 4.1-1.7 7-5.4 7-9.7V5.8L12 3Z',
    'm9.2 12.1 2 2 3.8-4',
  ],
  /** Pago (sustituye 💳). */
  tarjeta: [
    'M5 5.5h14A2.5 2.5 0 0 1 21.5 8v8a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 16V8A2.5 2.5 0 0 1 5 5.5Z',
    'M2.5 10h19',
    'M6 14.5h4',
  ],
  /** Globo de látex (sustituye 🎈): lágrima + brillo + nudo + cuerda en S. */
  globo: [
    'M12 2.2c3.8 0 6.5 2.9 6.5 6.5 0 3.5-2.5 6.3-5.3 7.3L12 16.4l-1.2-.4C8 15 5.5 12.2 5.5 8.7 5.5 5.1 8.2 2.2 12 2.2Z',
    'M8.7 7.7c.3-1.5 1.2-2.5 2.5-3',
    'M12 16.4l-1.4 1.8h2.8L12 16.4Z',
    'M12 18.2q-1.7 1.3 0 2.5t0 2.3',
  ],
  /** Eventos (sustituye 🎉): cono de fiesta con serpentinas y confeti. */
  fiesta: [
    'M3.5 20.5 8.3 9.6l6.1 6.1-10.9 4.8Z',
    'M5.9 15.05 8.95 18.1',
    'M11.8 8.2c1-1 1.1-2.5.3-3.6',
    'M15.8 12.2c1-.9 2.5-1 3.6-.2',
    'M16.2 7.8l2.2-2.2',
    'M14.6 3.6h.01',
    'M20.4 8.4h.01',
    'M20 15.6h.01',
  ],
  /** Negocio / emprendimiento (sustituye 💼). */
  maletin: [
    'M5.5 7.5h13A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V10a2.5 2.5 0 0 1 2.5-2.5Z',
    'M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5',
    'M3 12.8h18',
    'M12 11.6v2.4',
  ],
  /** Visto (sustituye ✓ en listas). */
  check: ['m5 12.5 4.5 4.5L19 7.5'],
  /** Países / cambiar país (sustituye 🌎 🌐). */
  mundo: [
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    'M12 3c-2.4 2.5-3.7 5.6-3.7 9s1.3 6.5 3.7 9c2.4-2.5 3.7-5.6 3.7-9S14.4 5.5 12 3Z',
    'M3.5 9h17',
    'M3.5 15h17',
  ],
  /** Flecha de avance (enlaces "Ver …"). */
  flecha: ['M4.5 12h15', 'm13.5 6 6 6-6 6'],
  /** Valoración. Para estrella rellena: `class="fill-current"`. */
  estrella: [
    'M12 3.4 14.53 9.32 20.94 9.9 16.09 14.13 17.53 20.4 12 17.1 6.47 20.4 7.91 14.13 3.06 9.9 9.47 9.32Z',
  ],
  /** Duración / a tu ritmo. */
  reloj: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'M12 7v5l3.2 2'],
  /** Asistencia / conversación (sustituye 💬). */
  chat: [
    'M6.5 17A2.5 2.5 0 0 1 4 14.5v-8A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V17Z',
    'M8 9h8',
    'M8 12.5h5',
  ],
  /** Tareas calificadas (sustituye 🧾): portapapeles con visto. */
  tareas: [
    'M8 4.5H6.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H16',
    'M9.5 3h5a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
    'm8.8 13.2 2.2 2.2 4.3-4.4',
  ],
  /** Correo (sustituye 📧). */
  correo: [
    'M5 5.5h14A2.5 2.5 0 0 1 21.5 8v8a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 16V8A2.5 2.5 0 0 1 5 5.5Z',
    'm3.5 7.5 7.3 5.6c.7.5 1.7.5 2.4 0l7.3-5.6',
  ],
  /** Pago seguro. */
  candado: [
    'M6.5 10.5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z',
    'M8 10.5v-3a4 4 0 0 1 8 0v3',
    'M12 14.5v2',
  ],
  /** Bonos incluidos. */
  regalo: [
    'M4.5 11h15v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-8Z',
    'M4 7.5h16a1 1 0 0 1 1 1V10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z',
    'M12 7.5v13',
    'M12 7.5C10.8 5 9.3 3.8 7.9 4.1c-1.3.3-1.4 2.2-.2 2.8.9.5 2.6.6 4.3.6Zm0 0c1.2-2.5 2.7-3.7 4.1-3.4 1.3.3 1.4 2.2.2 2.8-.9.5-2.6.6-4.3.6Z',
  ],
  /** Descuento / precio (sustituye 🔥 en chips de oferta). */
  etiqueta: [
    'M3.5 4.8v6.1c0 .5.2 1 .6 1.3l8.2 8.2c.7.7 1.8.7 2.5 0l5.1-5.1c.7-.7.7-1.8 0-2.5L11.7 4.6c-.4-.4-.8-.6-1.3-.6H4.3c-.5 0-.8.3-.8.8Z',
    'M9.3 8.1a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0Z',
  ],
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof ICONS;
