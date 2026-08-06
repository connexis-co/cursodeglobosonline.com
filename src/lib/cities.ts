/**
 * Contexto hiperlocal por ciudad (plan maestro §6.2): cada ciudad tiene un
 * párrafo propio y ≥2 FAQs únicas — nada de plantilla con el nombre cambiado.
 * Referencias locales reales (zonas, ferias, clima) escritas a mano.
 */
export interface CityLocal {
  /** Párrafo de contexto local único (mercado, zonas, cultura de eventos). */
  hook: string;
  faqs: { q: string; a: string }[];
}

export const CITY_LOCAL: Record<string, CityLocal> = {
  // ── Colombia ──────────────────────────────────────────────
  bogota: {
    hook: 'En Bogotá se celebra todo el año: primeras comuniones y bautizos en el norte, quinces en Suba y Kennedy, y un calendario corporativo que no para entre Chapinero y el centro empresarial. Ventaja local: con el clima frío de la sabana los globos pierden menos aire, así que los montajes de terraza y salón duran impecables todo el evento.',
    faqs: [
      { q: '¿Dónde consigo globos de buena calidad en Bogotá?', a: 'En el centro (San Victorino y alrededores) y en distribuidores de insumos para fiestas hay marcas profesionales por mayor. El curso te enseña a distinguir calibres y calidades para comprar bien desde la primera bolsa.' },
      { q: '¿Hay demanda de decoración con globos en Bogotá?', a: 'Muchísima: cumpleaños infantiles, quinces, grados de colegio y eventos de empresa. La mayoría de decoradoras se mueven por localidades (Suba, Engativá, Usaquén) y llenan agenda con solo el voz a voz de su zona.' },
    ],
  },
  medellin: {
    hook: 'Medellín vive de celebrar: cumpleaños en El Poblado y Laureles, quinces en Belén y la temporada fuerte de fin de año con la Feria de las Flores y los alumbrados. El clima cálido pide técnica: en el curso aprendes a calibrar el inflado para que el sol de la tarde no te reviente el montaje.',
    faqs: [
      { q: '¿La decoración con globos aguanta el clima de Medellín?', a: 'Sí, con técnica: inflar al 90% en exteriores, evitar superficies calientes y usar globo de calidad. El curso dedica lecciones a roturas y a montajes en exterior justamente por climas como el paisa.' },
      { q: '¿Puedo vender montajes en municipios cercanos como Envigado o Sabaneta?', a: 'Claro: el Valle de Aburrá funciona como un solo mercado. Muchas decoradoras arman su ruta entre Medellín, Envigado, Itagüí y Sabaneta y cobran el desplazamiento dentro de la cotización.' },
    ],
  },
  cali: {
    hook: 'Cali es fiesta por cultura: matrimonios, quinces con orquesta y la Feria de Cali en diciembre que dispara los eventos de empresa y de barrio. Los montajes en exteriores — tan comunes en el clima caleño — son de los que mejor se cobran, y el curso enseña las bases y estructuras que aguantan viento y calor.',
    faqs: [
      { q: '¿Diciembre es buena época para empezar en Cali?', a: 'Es LA época: entre novenas, Feria de Cali y fiestas de fin de año, las decoradoras caleñas llenan agenda desde noviembre. Ideal empezar el curso unos meses antes para llegar con repertorio.' },
      { q: '¿Qué tipo de eventos piden más globos en Cali?', a: 'Quinces, cumpleaños infantiles y revelaciones de sexo, más el mercado corporativo del sur de la ciudad. Los fondos fotográficos para fiestas con orquesta son un clásico local.' },
    ],
  },
  barranquilla: {
    hook: 'En Barranquilla el año tiene un pico que no existe en ninguna otra ciudad: el Carnaval. Entre enero y febrero los salones, verbenas y eventos de empresa se decoran a reventar, y el resto del año siguen los quinces y baby showers del Caribe. El curso te prepara para trabajar con calor y brisa costera sin que se te caiga la guirnalda.',
    faqs: [
      { q: '¿Cómo manejo el calor y la brisa de Barranquilla en los montajes?', a: 'Con estructuras bien ancladas, inflado al 90% y montaje a la sombra siempre que se pueda. Las lecciones de bases y soportes están pensadas para exteriores como los del Caribe.' },
      { q: '¿El Carnaval genera trabajo para decoradoras?', a: 'Muchísimo: casetas, sedes de comparsas, eventos de marcas y fiestas privadas contratan decoración desde diciembre. Es la temporada perfecta para lanzar tu portafolio.' },
    ],
  },
  bucaramanga: {
    hook: 'Bucaramanga, la ciudad de los parques, tiene un mercado de eventos fiel: bautizos, primeras comuniones, quinces y una cultura emprendedora que hace que los servicios locales se muevan por recomendación. Con el clima templado santandereano los globos rinden bien en interiores y exteriores por igual.',
    faqs: [
      { q: '¿Se puede vivir de la decoración con globos en Bucaramanga?', a: 'Sí: el área metropolitana (Floridablanca, Girón, Piedecuesta) suma un mercado grande de fiestas familiares, y la competencia profesional todavía es baja comparada con Bogotá o Medellín.' },
      { q: '¿Dónde se consiguen los insumos en Bucaramanga?', a: 'En el centro y en distribuidores de piñatería por mayor. El módulo de materiales te dice exactamente qué calibres y marcas pedir para no gastar de más.' },
    ],
  },
  cartagena: {
    hook: 'Cartagena es la capital de las bodas destino: parejas de todo el mundo se casan frente al mar y los decoradores locales cobran en dólares. También hay quinces, cruceros y eventos de hotel todo el año. El reto es el viento y la sal — y las técnicas de estructura del curso existen exactamente para eso.',
    faqs: [
      { q: '¿Puedo trabajar con hoteles y bodas destino en Cartagena?', a: 'Es el mercado más rentable de la ciudad: los wedding planners subcontratan decoración con globos para welcome parties y after parties. Un portafolio con 3 montajes buenos abre esas puertas.' },
      { q: '¿Los globos aguantan la brisa del mar?', a: 'Con anclaje correcto, sí: contrapesos, estructuras bajas y guirnaldas bien tejidas. El curso enseña las bases que se usan en montajes de playa.' },
    ],
  },
  // ── México ────────────────────────────────────────────────
  cdmx: {
    hook: 'En la Ciudad de México los XV años son industria nacional, y a eso súmale bautizos, revelaciones y los brunches de Roma y Condesa. Ventaja única: el Mercado de Jamaica y los distribuidores del Centro te dan insumos profesionales a precio de mayoreo a minutos de casa.',
    faqs: [
      { q: '¿Dónde compro globos al mayoreo en CDMX?', a: 'El Mercado de Jamaica y las tiendas del Centro Histórico manejan marcas profesionales por bulto. Con lo que aprendes en el módulo de materiales sabrás pedir el calibre correcto sin que te vendan de más.' },
      { q: '¿Hay mucha competencia de decoradoras en CDMX?', a: 'Hay mucha demanda y mucha oferta casera: la diferencia la marca la técnica. Un arco bien calibrado y fotos limpias en Instagram te separan del 90% en tu alcaldía.' },
    ],
  },
  guadalajara: {
    hook: 'Guadalajara es la capital de eventos del occidente: XV años en Zapopan, bautizos, posadas y una cultura de fiesta que llena los salones todos los fines de semana. No es casualidad que los locales de decoración tapatíos aparezcan primero en Google — el mercado da para muchos más.',
    faqs: [
      { q: '¿En qué zonas de Guadalajara hay más trabajo de decoración?', a: 'Zapopan y la zona de salones de eventos concentran XV años y bodas; Tlaquepaque y Tonalá mueven fiesta familiar. La mayoría de decoradoras cubren toda la ZMG cobrando traslado.' },
      { q: '¿Las posadas son temporada alta?', a: 'Sí: de noviembre a enero se juntan posadas, graduaciones y XV años. Es la mejor ventana del año para estrenar tu servicio.' },
    ],
  },
  monterrey: {
    hook: 'Monterrey mezcla dos mercados que pagan bien: el corporativo — inauguraciones, aniversarios de empresa, activaciones — y las bodas y XV años en los jardines de Santiago y el sur de la ciudad. El calor regio exige inflado y anclaje profesional, justo lo que el curso resuelve.',
    faqs: [
      { q: '¿El calor de Monterrey daña los montajes?', a: 'Si inflas al 100% al sol, sí. Por eso el curso enseña a calibrar al 90% en exterior, buscar sombra para el montaje y usar globo de látex grueso: así tus arcos aguantan la tarde completa.' },
      { q: '¿Cómo entro al mercado corporativo regio?', a: 'Con un portafolio limpio y puntualidad: las empresas repiten proveedor. Un par de montajes para pymes locales te da las fotos para llegar a clientes más grandes.' },
    ],
  },
  puebla: {
    hook: 'Puebla celebra con calendario lleno: bautizos, primeras comuniones, XV años y las posadas más largas del país. Es además una de las ciudades donde más buscan cursos de globoflexia en Google — señal clara de que la demanda local va por delante de la oferta profesional.',
    faqs: [
      { q: '¿Por qué conviene certificarse si estoy en Puebla?', a: 'Porque la demanda de decoración crece más rápido que la oferta con técnica: quien muestra certificado y un portafolio pulido cobra tarifas de CDMX sin salir de Puebla.' },
      { q: '¿Puedo cubrir Cholula y los alrededores?', a: 'Sí, y conviene: los salones de eventos de Cholula y Atlixco contratan decoración externa constantemente. Se cotiza con traslado incluido.' },
    ],
  },
  cancun: {
    hook: 'Cancún vive de eventos: bodas de playa, despedidas, revelaciones frente al mar y una industria hotelera que subcontrata decoración todo el año. Aquí los montajes se cobran en dólares — y el viento del Caribe se doma con las estructuras y contrapesos que enseña el curso.',
    faqs: [
      { q: '¿Puedo trabajar con hoteles y wedding planners en Cancún?', a: 'Es el camino natural: los planners buscan decoradoras confiables para welcome dinners y beach parties. Con portafolio y respuesta rápida por WhatsApp entras al circuito.' },
      { q: '¿Cómo evito que el viento arruine un montaje de playa?', a: 'Estructuras bajas, contrapesos generosos y guirnaldas bien tejidas — técnica que el curso cubre en las lecciones de bases y soportes.' },
    ],
  },
  // ── Perú ──────────────────────────────────────────────────
  lima: {
    hook: 'En Lima los baby showers y cumpleaños se toman Miraflores, San Borja y Surco cada fin de semana, y el Centro concentra galerías de insumos para fiestas a precio de mayorista. La garúa limeña no es problema: los eventos son mayormente bajo techo y los globos rinden parejo.',
    faqs: [
      { q: '¿Dónde consigo insumos de decoración en Lima?', a: 'Las galerías del Centro de Lima y el Mercado Central venden globo profesional por bulto. El módulo de materiales te dice qué marcas y calibres pedir.' },
      { q: '¿Qué eventos piden más decoración en Lima?', a: 'Baby showers, revelaciones y cumpleaños infantiles en los distritos residenciales, más el mercado corporativo de San Isidro que paga tarifas premium.' },
    ],
  },
  arequipa: {
    hook: 'Arequipa celebra en patios coloniales de sillar con el Misti de fondo: bodas, quinceañeros y el aniversario de la ciudad en agosto que llena los salones. La altura moderada (2.300 m) cambia un poco el inflado — el curso te enseña a calibrar para que el globo no se pase de presión.',
    faqs: [
      { q: '¿La altura de Arequipa afecta los globos?', a: 'Un poco: a mayor altura el aire interno se expande, así que se infla ligeramente por debajo del máximo. Es un ajuste simple que el curso cubre en la lección de calibrado.' },
      { q: '¿Hay mercado para decoradoras en Arequipa?', a: 'Sí y creciendo: los locales de eventos del centro y Cayma buscan proveedores constantes, y agosto (aniversario) es temporada alta garantizada.' },
    ],
  },
  trujillo: {
    hook: 'Trujillo, la ciudad de la eterna primavera, tiene su pico anual en el Festival de la Primavera y el concurso de marinera, cuando salones y clubes se decoran a full. El clima templado costero es de los más nobles para el látex: tus montajes duran el evento completo sin drama.',
    faqs: [
      { q: '¿Cuál es la temporada alta en Trujillo?', a: 'Septiembre-octubre por el Festival de la Primavera, enero por la marinera, más matrimonios y quinces todo el año. Conviene tener el portafolio listo antes de septiembre.' },
      { q: '¿Puedo atender balnearios como Huanchaco?', a: 'Sí: los eventos frente al mar piden decoración con anclaje — técnica que el curso enseña — y se cobran con recargo por traslado.' },
    ],
  },
  cusco: {
    hook: 'Cusco mezcla celebraciones locales — quinces, bautizos, fiestas patronales — con un flujo turístico que contrata eventos privados todo el año. A 3.400 metros el inflado cambia de verdad: aquí el calibrado que enseña el curso deja de ser un detalle y se vuelve la diferencia entre un arco perfecto y globos reventados.',
    faqs: [
      { q: '¿Cómo se trabaja el globo en la altura de Cusco?', a: 'Inflando por debajo del máximo y evitando cambios bruscos de temperatura: el aire interno se expande más a 3.400 m. La lección de calibrado y roturas te da la técnica exacta.' },
      { q: '¿El turismo genera trabajo de decoración en Cusco?', a: 'Sí: hoteles y restaurantes montan cenas privadas, pedidas de mano y cumpleaños para viajeros — eventos pequeños que pagan muy bien por montaje.' },
    ],
  },
  // ── Ecuador ───────────────────────────────────────────────
  quito: {
    hook: 'Quito celebra entre las Fiestas de Quito en diciembre, bautizos y quinces en los valles de Cumbayá y Los Chillos, y un mercado corporativo estable en el norte. A 2.800 metros aplica la regla de oro de la altura: inflar un punto por debajo, tal como lo enseña la lección de calibrado.',
    faqs: [
      { q: '¿La altura de Quito cambia la técnica?', a: 'Sí, ligeramente: el globo se expande más, así que se infla al 85-90%. Con ese ajuste tus guirnaldas duran igual que a nivel del mar.' },
      { q: '¿Cuándo es la temporada alta en Quito?', a: 'Diciembre completo (Fiestas de Quito + Navidad) y el calendario de quinces todo el año, con los valles como zona fuerte de salones.' },
    ],
  },
  guayaquil: {
    hook: 'Guayaquil es calor, río y fiesta: cumpleaños en Samborondón, quinces, revelaciones y las Fiestas Julianas que llenan la agenda de julio. El clima costero exige globo de calidad e inflado al 90% — técnica que el curso repite hasta que te salga sola.',
    faqs: [
      { q: '¿Cómo aguantan los globos el calor guayaquileño?', a: 'Con látex grueso, inflado al 90% y montaje a la sombra o bajo techo. Las lecciones de roturas y exteriores están pensadas para climas exactamente como este.' },
      { q: '¿Samborondón es buen mercado para empezar?', a: 'Es de los mejores del país: urbanizaciones con fiestas cada fin de semana y clientas que pagan por calidad y puntualidad.' },
    ],
  },
  cuenca: {
    hook: 'Cuenca celebra con estilo patrimonial: bodas en haciendas, bautizos en el centro histórico y las fiestas de fundación e independencia que decoran la ciudad entera. El mercado premium de eventos cuencano paga bien los acabados finos — flores de globo, tonos pastel, estructuras limpias.',
    faqs: [
      { q: '¿Qué estilo de decoración se vende más en Cuenca?', a: 'Elegante y pastel: bodas y bautizos en espacios patrimoniales piden guirnaldas orgánicas sobrias y flores con globos — justo las técnicas de los cursos de flores y bouquets.' },
      { q: '¿Hay trabajo fuera de las fiestas de noviembre?', a: 'Sí: el calendario de bodas y bautizos es constante, y las haciendas de los alrededores contratan decoración externa todo el año.' },
    ],
  },
  // ── Chile ─────────────────────────────────────────────────
  santiago: {
    hook: 'En Santiago los cumpleaños y baby showers llenan Providencia, Ñuñoa y Las Condes, y el 18 — Fiestas Patrias — multiplica los eventos de empresa y las fondas decoradas. Persa Biobío y el centro concentran insumos por mayor para partir con poca inversión.',
    faqs: [
      { q: '¿Dónde compro globos por mayor en Santiago?', a: 'En el centro (Meiggs) y distribuidores de cotillón por mayor. Con el módulo de materiales sabrás qué marcas rinden y cuáles evitar.' },
      { q: '¿Las Fiestas Patrias dan trabajo de decoración?', a: 'Mucho: empresas, colegios y fondas contratan ambientación en septiembre. Es el mejor mes del año para estrenar tu emprendimiento.' },
    ],
  },
  valparaiso: {
    hook: 'Valparaíso y Viña del Mar viven de celebrar con vista al mar: matrimonios boho en los cerros, año nuevo con los fuegos más famosos de Chile y una escena de eventos culturales constante. La brisa porteña pide anclaje y estructura — técnica que el curso cubre a fondo.',
    faqs: [
      { q: '¿Cómo manejo el viento de los cerros en un montaje?', a: 'Estructuras bajas, contrapesos y guirnaldas bien tejidas: las lecciones de bases y soportes existen para escenarios como los cerros porteños.' },
      { q: '¿Viña del Mar cuenta como mercado aparte?', a: 'Funciona como un solo circuito con Valpo: matrimonios, eventos de hotel y celebraciones de verano que se cotizan con traslado corto.' },
    ],
  },
  concepcion: {
    hook: 'Concepción es ciudad universitaria: graduaciones, gala de carreras y cumpleaños llenan el calendario, más el mercado familiar del Gran Concepción. Las decoradoras penquistas con técnica real escasean — la ventana perfecta para entrar con un portafolio profesional.',
    faqs: [
      { q: '¿Las graduaciones son buen nicho en Concepción?', a: 'Excelente: entre licenciaturas de colegio y titulaciones universitarias hay demanda todo el año, con pico en diciembre. Los arcos para fotos son el producto estrella.' },
      { q: '¿Puedo atender Talcahuano y San Pedro?', a: 'Sí: el Gran Concepción se trabaja como un solo mercado y el traslado se suma a la cotización.' },
    ],
  },
  // ── Argentina ─────────────────────────────────────────────
  buenosaires: {
    hook: 'En Buenos Aires los cumpleaños en salones de Palermo y Caballito, los 15 con producción completa y el circuito corporativo mueven decoración toda la semana. El barrio de Once es tu aliado: insumos de cotillón por mayor a precios que hacen cerrar cualquier presupuesto.',
    faqs: [
      { q: '¿Dónde consigo insumos baratos en Buenos Aires?', a: 'Once es el clásico: cotillón por mayor con todas las marcas. El módulo de materiales te dice qué calibres pedir para acabado profesional.' },
      { q: '¿Los 15 siguen siendo un buen mercado en CABA y GBA?', a: 'Enorme: la fiesta de 15 sigue siendo LA celebración argentina, y los fondos fotográficos con globos son parte del estándar de producción.' },
    ],
  },
  cordoba: {
    hook: 'Córdoba festeja como pocas: cumpleaños con cuarteto, 15 en salones de Nueva Córdoba y Cerro, y una vida universitaria que suma graduaciones todo el año. El mercado cordobés premia lo bien hecho — un arco parejo y fotos limpias te llenan la agenda por recomendación.',
    faqs: [
      { q: '¿Hay demanda de decoración fuera de capital?', a: 'Sí: Villa Carlos Paz y las sierras suman eventos de turismo y celebraciones que contratan proveedores cordobeses con traslado.' },
      { q: '¿Qué producto conviene ofrecer primero en Córdoba?', a: 'Fondos fotográficos para 15 y cumpleaños: alto impacto, materiales accesibles y es lo que más se comparte en redes locales.' },
    ],
  },
  rosario: {
    hook: 'Rosario celebra junto al río: cumpleaños en salones de Pichincha, 15, baby showers y eventos de empresa del cordón industrial. Es plaza grande con oferta profesional chica — las decoradoras con técnica y puntualidad se pasan el dato entre salones.',
    faqs: [
      { q: '¿Cómo consigo mis primeros clientes en Rosario?', a: 'Alianza con 2-3 salones de eventos: les resolvés la decoración a sus clientes y ellos te recomiendan. El módulo de negocio enseña cómo proponerlo.' },
      { q: '¿El clima húmedo afecta los globos?', a: 'La humedad rosarina no es problema; el sol directo sí. Montaje a la sombra e inflado al 90% en exteriores, como enseña el curso.' },
    ],
  },
  mendoza: {
    hook: 'Mendoza tiene el mercado premium de Argentina: bodas en bodegas y viñedos, eventos de vendimia y celebraciones con paisaje de cordillera. Los wedding planners mendocinos subcontratan decoración constantemente — y el aire seco local es aliado del látex bien calibrado.',
    faqs: [
      { q: '¿Cómo entro al circuito de bodas en bodegas?', a: 'Portafolio con estética elegante (tonos crema, dorado, verde) y contacto directo con planners y bodegas boutique. Los cursos de flores y bouquets dan justo ese acabado.' },
      { q: '¿La vendimia genera trabajo extra?', a: 'Sí: febrero-marzo suma eventos corporativos, agasajos y fiestas privadas alrededor de la Fiesta de la Vendimia.' },
    ],
  },
  // ── España ────────────────────────────────────────────────
  madrid: {
    hook: 'En Madrid los cumpleaños temáticos, baby showers y comuniones llenan los fines de semana de Chamberí a Vallecas, y el circuito corporativo y de inauguraciones paga tarifas europeas. La comunidad latina además trae consigo la cultura de la quinceañera y las revelaciones — mercado que crece cada año.',
    faqs: [
      { q: '¿Cuánto se cobra un arco de globos en Madrid?', a: 'Bastante más que el costo del material: los montajes profesionales se cotizan por diseño e instalación, y el módulo de presupuesto te enseña a calcularlo en euros sin regalarte.' },
      { q: '¿Las comuniones son buena temporada?', a: 'Abril-junio es pico total: comuniones y bautizos encadenados cada sábado. Conviene tener el portafolio listo en marzo.' },
    ],
  },
  barcelona: {
    hook: 'Barcelona mezcla fiestas familiares en Gràcia y Sant Andreu, eventos de empresa y una escena internacional que celebra de todo, de baby showers a brand activations. El estilo que triunfa aquí es el orgánico mediterráneo: tonos tierra, crema y toques dorados — la estética exacta de las guirnaldas del curso.',
    faqs: [
      { q: '¿Qué estilo de decoración pide Barcelona?', a: 'Orgánico y elegante: guirnaldas asimétricas en tonos neutros con acentos. Las técnicas de guirnalda y flores del curso encajan directo con esa demanda.' },
      { q: '¿Puedo trabajar eventos de empresa?', a: 'Sí: agencias de eventos subcontratan decoración para activaciones y aperturas. Un portafolio con 4-5 montajes limpios es la puerta de entrada.' },
    ],
  },
  valencia: {
    hook: 'Valencia celebra a lo grande: Fallas en marzo, comuniones en primavera y cumpleaños junto a la playa el resto del año. La ciudad vive la decoración festiva como pocas en España — y quien domina estructuras y color tiene trabajo de sobra en fiestas privadas y locales.',
    faqs: [
      { q: '¿Las Fallas dan trabajo a decoradoras con globos?', a: 'Sí: casales, comercios y fiestas privadas alrededor de Fallas contratan ambientación. Marzo es el mes para tener agenda abierta y precios listos.' },
      { q: '¿Qué se celebra el resto del año en Valencia?', a: 'Comuniones (primavera), bodas junto al mar y cumpleaños todo el año, con la Malvarrosa y los salones del centro como escenarios habituales.' },
    ],
  },
  sevilla: {
    hook: 'Sevilla es celebración pura: la Feria de Abril, las cruces de mayo, bautizos y comuniones que llenan los salones de Triana a Nervión. El calor sevillano de verano pide técnica de inflado y montaje en interior — y el resto del año la ciudad decora sin parar.',
    faqs: [
      { q: '¿Cómo se trabaja el globo con el calor de Sevilla?', a: 'En verano: montajes en interior o al caer la tarde, inflado al 90% y látex de calidad. La lección de roturas te ahorra los sustos de julio y agosto.' },
      { q: '¿La Feria genera encargos?', a: 'Sí: casetas particulares y empresas piden ambientación, y las semanas previas son de las más movidas del año para las decoradoras locales.' },
    ],
  },
  malaga: {
    hook: 'Málaga y la Costa del Sol viven del evento: bodas frente al mar, cumpleaños de residentes internacionales y una feria de agosto que enciende la ciudad. Aquí se factura en euros y en varios idiomas — y la brisa marina se maneja con las estructuras y contrapesos del curso.',
    faqs: [
      { q: '¿Hay mercado internacional en Málaga?', a: 'Mucho: residentes británicos, nórdicos y franceses celebran cumpleaños y bodas y pagan tarifas premium por decoración profesional con entrega puntual.' },
      { q: '¿Puedo cubrir Marbella y la costa?', a: 'Sí: el circuito Málaga-Marbella-Estepona funciona con traslados cortos y los eventos de villa son de los mejor pagados de España.' },
    ],
  },
  bilbao: {
    hook: 'Bilbao celebra con fuerza propia: Aste Nagusia en agosto, cumpleaños y bautizos en Indautxu y Deusto, y un mercado de eventos de empresa serio alrededor de la ría. La oferta de decoración con globos profesional aún es corta en el norte — ventaja clara para quien llegue con técnica.',
    faqs: [
      { q: '¿Hay competencia de decoradoras en Bilbao?', a: 'Menos que en Madrid o Barcelona: el mercado del norte está menos saturado y quien muestra acabado profesional destaca rápido.' },
      { q: '¿La Semana Grande genera encargos?', a: 'Sí: comercios, txosnas y fiestas privadas piden ambientación en agosto, y el resto del año sostienen bautizos, comuniones y eventos de empresa.' },
    ],
  },
  // ── Estados Unidos ────────────────────────────────────────
  miami: {
    hook: 'Miami es la capital del evento latino en Estados Unidos: quinces con producción de película, baby showers en Doral y Kendall, y una industria de party rentals que subcontrata decoración cada fin de semana. Aquí los montajes se cobran en dólares y el portafolio de Instagram es tu mejor vendedor.',
    faqs: [
      { q: '¿Cuánto se cobra un montaje de globos en Miami?', a: 'Los precios en dólares multiplican varias veces el costo del material: los arcos orgánicos profesionales se cotizan por diseño e instalación. El módulo de presupuesto aplica directo.' },
      { q: '¿El curso me sirve si trabajo en inglés y español?', a: 'Sí: la técnica es universal y el mercado de Miami es bilingüe por naturaleza. La clientela latina además busca decoradoras que entiendan quinces y revelaciones.' },
    ],
  },
  houston: {
    hook: 'Houston tiene una de las comunidades latinas más grandes del país y un calendario de quinceañeras, bautizos y revelaciones que no para. Los party halls del suroeste y de Pasadena contratan decoración externa constantemente — mercado enorme y en español.',
    faqs: [
      { q: '¿Hay demanda en español en Houston?', a: 'Toda: gran parte del mercado de fiestas del área funciona en español, de los salones a los proveedores. Tu servicio puede operar 100% en tu idioma.' },
      { q: '¿Qué producto se vende más?', a: 'Arcos y marcos para quinces y revelaciones de sexo, más los fondos fotográficos que los salones piden como estándar.' },
    ],
  },
  losangeles: {
    hook: 'Los Ángeles celebra en dos idiomas y a lo grande: quinces en el este, baby showers en el Valle y un mercado de eventos que abarca de backyards familiares a producciones con presupuesto. El distrito de fiestas del centro (los party supply de LA) te da insumos de mayoreo a minutos.',
    faqs: [
      { q: '¿Dónde consigo insumos al mayoreo en Los Ángeles?', a: 'El Fashion District y los party supply del centro venden globo profesional por bulto. Con el módulo de materiales sabrás exactamente qué pedir.' },
      { q: '¿Los backyard parties son buen mercado?', a: 'Excelente: la fiesta de patio angelina es una institución y siempre lleva arco o marco fotográfico. Es el encargo perfecto para empezar.' },
    ],
  },
  newyork: {
    hook: 'Nueva York celebra en cada borough: cumpleaños en apartamentos de Queens y el Bronx, baby showers dominicanos y mexicanos, y un mercado de eventos corporativos que paga tarifas de Manhattan. Los espacios pequeños piden diseño inteligente — guirnaldas y marcos que el curso enseña a montar rápido y sin desorden.',
    faqs: [
      { q: '¿Se puede decorar en apartamentos pequeños de NYC?', a: 'Sí: guirnaldas de pared, medios arcos y marcos compactos son el producto estrella en la ciudad. El curso enseña montaje e instalación limpia en espacios reducidos.' },
      { q: '¿La clientela latina de NYC contrata en español?', a: 'Muchísima: Queens, el Bronx y Washington Heights celebran en español y el voz a voz entre comunidades llena agendas.' },
    ],
  },
  chicago: {
    hook: 'Chicago tiene en La Villita y Pilsen dos de los corredores mexicanos más grandes de Estados Unidos: quinces, bautizos y posadas mueven decoración todo el año, con el verano como temporada dorada de fiestas en patios y parques. El invierno traslada todo a interiores — doble temporada, doble mercado.',
    faqs: [
      { q: '¿El invierno frena el negocio en Chicago?', a: 'Lo mueve a interiores: salones, casas y party halls siguen celebrando quinces y cumpleaños. El frío extremo solo cambia la logística del transporte de globos inflados.' },
      { q: '¿Dónde está la clientela latina en Chicago?', a: 'La Villita, Pilsen, Cicero y los suburbios del oeste concentran la comunidad mexicana y centroamericana que celebra con decoración tradicional de fiesta.' },
    ],
  },
};

export function getCityLocal(citySlug: string): CityLocal | undefined {
  return CITY_LOCAL[citySlug];
}
