import type { Project } from "@/data/portfolio";

type ProjectTranslation = Pick<
  Project,
  | "label"
  | "category"
  | "summary"
  | "problem"
  | "approach"
  | "contribution"
  | "learnings"
  | "steps"
  | "event"
  | "challenge"
  | "highlights"
  | "next"
> & { metricLabels: string[] };

export const spanishProjects: Record<string, ProjectTranslation> = {
  phonendo: {
    label: "Datos de salud privados, pagos verificables en Stellar",
    category: "Hackathon de Stellar · Equipo de 5 · Líder del proyecto",
    event: {
      name: "HackMeridian Lisboa 2026 · Genesis track",
      seals: [
        { title: "Finalista del Shark Tank", kind: "finalist" },
        { title: "Beca HackMeridian", kind: "grant" },
      ],
    },
    summary:
      "Un sensor demuestra que un paciente ha completado su sesión de rehabilitación cardiaca sin revelar sus datos de salud, y un contrato inteligente en Stellar verifica la prueba y le paga en USDC. Lo lideré de la idea a la demo funcional en un fin de semana.",
    metricLabels: [
      "restricciones del circuito",
      "WASM del contrato",
      "casos de uso, un circuito",
      "fin de semana, de la idea a la demo",
    ],
    problem:
      "Tras un evento cardiaco, la rehabilitación funciona: reduce la mortalidad cardiovascular y los reingresos hospitalarios (Cochrane, 2022). Aun así, la mayoría de pacientes no la empieza o la abandona, y en España la hace menos del 1 % (EUROASPIRE III). Las aseguradoras pagarían encantadas por esa adherencia, pero demostrarla obliga a recoger datos de salud muy sensibles que el paciente, con razón, no quiere entregar.",
    approach:
      "¿Y si los datos nunca tuvieran que salir del paciente? Phonendo convierte las lecturas del sensor en una prueba de conocimiento cero (demostrar que algo es cierto sin revelar los datos). La aseguradora solo sabe que la sesión se completó, y un contrato inteligente en Stellar verifica la prueba y paga al paciente en USDC, sin intermediarios. La misma infraestructura sirve para la cadena de frío: demostrar que un envío se mantuvo entre 2 y 8 °C.",
    contribution:
      "Lideré el proyecto y asumí todo el camino crítico: el circuito ZK, el contrato inteligente en Soroban (la plataforma de contratos de Stellar), la integración del pipeline completo y la demo. También llevé el repositorio, la documentación y la calidad de la entrega. Parri construyó el puente del Publisher y las claves, César el hardware, Manuel la web y Lucía el pitch y el vídeo.",
    challenge:
      "Circom genera las pruebas por defecto sobre la curva BN254, pero el verificador Groth16 oficial de Stellar usa BLS12-381. Detectarlo pronto y recompilar salvó el proyecto. Además, até cada prueba a datos reales del sensor mediante un hash Poseidon firmado (una huella digital pensada para ZK) de cada lote, y depuré herramientas de prueba que fallaban en silencio, todo contra reloj.",
    highlights: [
      "Diseñé un circuito Groth16 en Circom (~2.000 restricciones) sobre BLS12-381 con un compromiso Poseidon, además del trusted setup y los scripts de prueba.",
      "Programé claim() en el contrato Soroban: comprueba una firma ed25519, verifica la prueba on-chain, impide cobros dobles y paga en USDC. Con tests y un WASM de 9,9 KB.",
      "Conseguí el primer cobro on-chain con prueba ZK en la testnet de Stellar el 25 de octubre, y después un segundo caso de uso, la cadena de frío, con la misma clave del Verifier.",
      "Preparé el go-to-market del pitch: comprador, hipótesis de precio, plan piloto y estadísticas clínicas verificadas.",
    ],
    learnings:
      "Comprobar primero las suposiciones de compatibilidad: un solo desajuste de curva nos habría costado el fin de semana entero. Y una demo convence cuando es real de principio a fin: un sensor, una prueba y un pago que se puede abrir en el explorador de bloques.",
    next: "Comprobar dentro del circuito los huecos entre lecturas, firmar a nivel de hardware en el propio sensor y un piloto con un centro de rehabilitación en Portugal o España.",
    steps: ["Sensor", "Prueba ZK", "Contrato Soroban", "Pago en USDC"],
  },
  algas: {
    label: "Del sargazo al gas: energía local a partir de un residuo",
    category: "Impacto social · Energía · Equipo de 2",
    event: {
      name: "Escuela de la Energía 2026 · Fundación EDP y Ashoka",
      seals: [{ title: "Proyecto ganador · 2.500 €", kind: "winner" }],
    },
    summary:
      "Convertir el sargazo que llega a las playas del Caribe, y que hoy se entierra o acaba en el vertedero, en electricidad para las propias comunidades costeras. Proyecto ganador y financiado en la Escuela de la Energía de Fundación EDP y Ashoka.",
    metricLabels: [
      "de financiación",
      "de pitch ante el jurado",
      "versiones del pitch",
    ],
    problem:
      "El sargazo es un alga que llega en cantidades enormes a las costas del Caribe: solo en República Dominicana se habló de más de tres millones de toneladas en 2024. En la orilla se pudre, vacía las playas y castiga a los negocios locales. Lo que se recoge casi siempre se entierra o va al vertedero; el propio Gobierno dominicano se marca como meta gestionar bien solo el 5 % del sargazo de 2026.",
    approach:
      "Gestionarlo allí mismo, en la costa: se recoge, se seca, se gasifica (se calienta con muy poco oxígeno hasta convertirlo en un gas combustible) y ese gas mueve un motor que genera electricidad. El calor del motor seca la siguiente carga, que llega empapada. Algo pequeño, local y replicable playa a playa, empezando por Guayacanes y Juan Dolio, en el sur de República Dominicana.",
    contribution:
      "UDIMA nos eligió a Ismail Benbdelkhalek y a mí para representar a la universidad. Juntos construimos el proyecto de principio a fin: el análisis del problema, la elección de una comunidad concreta, un pitch de tres minutos para un jurado no técnico con cada cifra respaldada por fuentes oficiales, una llamada a la acción para sumar aliados y la marca. Iteramos el pitch nueve veces y lo defendimos ante el jurado en Madrid.",
    learnings:
      "Contar un problema es contar una persona: el pitch empezó a funcionar cuando abrimos con un trabajador que limpia su playa cada mañana, y no con toneladas. La honestidad convence: decir con claridad qué falta por demostrar generó más confianza que prometer una planta. Y me sacó del software, hacia la energía, el impacto social y las comunidades reales.",
    next: "Conseguir el primer dato real: cuánta energía sale de una tonelada de alga y si compensa el coste de secarla. Antes de traer sargazo del Caribe, ensayaremos con el alga asiática (Rugulopteryx okamurae), que invade las playas del Estrecho, y ya hemos identificado grupos de investigación en la Universidad de Cádiz, la Universidad de Sevilla y el CEDER-CIEMAT.",
    steps: ["Recoger", "Secar", "Gasificar", "Electricidad"],
  },
  "mapping-blockchain-ecosystem": {
    label: "Encontrar relaciones en los datos de gobernanza",
    category: "Proyecto de fin de grado · Software y datos",
    summary:
      "Pipelines reproducibles y modelos de grafos que convierten grandes conjuntos de datos de gobernanza, con sus imperfecciones, en relaciones medibles.",
    metricLabels: ["DAOs en el dataset", "propuestas", "de votos"],
    problem:
      "La actividad de gobernanza está repartida entre distintas plataformas DAO. Un gran conjunto de datos solo resulta útil si se entienden sus inconsistencias y se definen relaciones relevantes y medibles.",
    approach:
      "El equipo está explorando datos de varias plataformas de gobernanza, desarrollando pipelines de procesamiento reproducibles y construyendo modelos de grafos. Definimos y comprobamos las relaciones entre organizaciones descentralizadas antes de extraer conclusiones de la red.",
    contribution:
      "Mi trabajo incluye explorar y procesar grandes conjuntos de datos, desarrollar pipelines, definir relaciones medibles entre DAOs, construir grafos y realizar validaciones y comprobaciones de coherencia. También documento los hallazgos y las decisiones técnicas para poder revisar y reproducir el análisis.",
    learnings:
      "Estoy aprendiendo cómo la calidad de los datos, la definición de las relaciones y la validación afectan a un modelo de grafos. Además de construir el pipeline, documento las suposiciones del análisis.",
    steps: [
      "Datos de gobernanza",
      "Procesamiento y validación",
      "Modelos de relaciones",
      "Análisis de grafos",
    ],
  },
  "la-abuelita": {
    label: "Sistema de negociación multiagente",
    category: "Hackathon de 48 horas · Equipo de 3",
    summary:
      "Agentes autónomos que negocian con información de mercado e inteligencia compartida. Construido en 48 horas.",
    metricLabels: ["de desarrollo", "tests", "commits", "líneas de Python"],
    problem:
      "¿Cómo deben negociar los agentes autónomos cuando las mejores decisiones dependen de un mercado que cambia? Durante el hackathon de Claude Code, descubrimos que responder más rápido no resolvía el verdadero cuello de botella: los agentes necesitaban mejor información.",
    approach:
      "Construimos un sistema multiagente para negociar con compradores y vendedores, analizar la actividad del mercado y compartir información. Durante el desarrollo, los agentes pasaron a usar datos de mercado y negociaciones previas para ajustar sus decisiones, apoyándose en la información compartida entre ellos.",
    contribution:
      "Desarrollo colaborativo en un equipo de tres personas durante un hackathon de 48 horas. Iteramos sobre el comportamiento de negociación, el análisis del mercado y el intercambio de información, adaptando el sistema conforme entendíamos mejor el mercado.",
    learnings:
      "Aprendimos a identificar qué limitaba el sistema antes de optimizarlo. Una mejor información de mercado importaba más que responder más rápido. Los tests nos ayudaron a comprobar los cambios con un plazo muy ajustado.",
    steps: [
      "Agentes compradores",
      "Motor de negociación",
      "Agentes vendedores",
      "Inteligencia de mercado compartida",
    ],
  },
  embarca: {
    label: "Retos reales de empresas para el talento joven",
    category: "Hackathon de un día · Equipo de 5",
    event: {
      name: "Hackathon Iberoamérica 2030 · Club Hispanidad Futura",
      seals: [
        { title: "Premio al Mejor Pitch", kind: "pitch" },
        { title: "2.º puesto general", kind: "second" },
      ],
    },
    summary:
      "Las empresas publican retos reales, los estudiantes los resuelven en remoto y cada entrega valorada queda en su pasaporte de talento, aunque no ganen.",
    metricLabels: [],
    problem:
      "El reto era crear más oportunidades para el talento joven entre países iberoamericanos. Las ofertas junior piden una experiencia que los jóvenes todavía no pueden tener, y un título no viaja bien entre países. Una valoración de una empresa real, sí.",
    approach:
      "Construimos Embarca, un prototipo funcional para España y Colombia. Una empresa describe lo que necesita, la IA lo convierte en un reto corto con una rúbrica pública, los estudiantes lo resuelven en remoto y la empresa valora todas las entregas. La IA prepara el reto y resume las entregas, pero la nota la pone una persona.",
    contribution:
      "Desarrollé la parte en la que una empresa describe con sus palabras lo que necesita y la IA lo convierte en un reto listo para publicar: enunciado, entregable, plazo y rúbrica, que la empresa puede editar antes de publicarlo. También trabajé en el plan de piloto de 90 días para el pitch. Cada una de las cinco personas del equipo construyó su parte, coordinándonos mediante GitHub Issues.",
    learnings:
      "El feedback de los mentores cambió bastante nuestra idea: la acotamos a un nicho, buscamos la causa raíz y dejamos clara la diferencia con las plataformas existentes. Dividir la app en partes independientes permitió que cinco personas trabajaran en paralelo sin bloquearse.",
    steps: [
      "Necesidad de la empresa",
      "Reto generado con IA",
      "Estudiantes en remoto",
      "Pasaporte de talento",
    ],
  },
  "aws-cloud-devops-lab": {
    label: "De la aplicación a la infraestructura",
    category: "Cloud · Despliegue de aplicaciones",
    summary:
      "Aprender flujos de despliegue ejecutando aplicaciones en contenedores en AWS.",
    metricLabels: [],
    problem:
      "Escribir una aplicación es solo una parte de entregar software. Empaquetarla, gestionar su imagen de contenedor y ejecutarla en infraestructura cloud exige otro conjunto de decisiones de ingeniería.",
    approach:
      "Estoy desarrollando un laboratorio para desplegar aplicaciones en contenedores en AWS: empaquetar el código con Docker, almacenar imágenes en ECR y ejecutar cargas de trabajo en ECS.",
    contribution:
      "Desarrollo del laboratorio para aprender infraestructura cloud y flujos DevOps mediante despliegues prácticos, con Python, Docker, ECR y ECS.",
    learnings:
      "Estoy aprendiendo cómo el código se convierte en una aplicación en ejecución y qué responsabilidades corresponden a la aplicación, al contenedor y a los servicios cloud que utiliza.",
    steps: [
      "GitHub / Aplicación",
      "Docker",
      "ECR",
      "ECS",
      "Infraestructura AWS",
    ],
  },
  "algorithmic-techniques": {
    label: "Algoritmos y estructuras de datos en C++",
    category: "Fundamentos de ingeniería · Algoritmos",
    summary:
      "Implementaciones en C++ de grafos, programación dinámica, estrategias voraces y estructuras de datos.",
    metricLabels: [],
    problem:
      "Cada problema puede requerir estructuras y estrategias diferentes. Implementar estas técnicas directamente ayuda a comprender cómo funciona un algoritmo y cuándo resulta útil.",
    approach:
      "Una colección en desarrollo de implementaciones en C++ de grafos, programación dinámica, algoritmos voraces, heaps, colas de prioridad y resolución de problemas algorítmicos.",
    contribution:
      "Implementación y estudio de algoritmos clásicos y estructuras de datos en C++, con atención al razonamiento que hay detrás de cada solución.",
    learnings:
      "Estoy aprendiendo a elegir representaciones de datos, explicar por qué funciona una solución y comparar las ventajas y limitaciones de los distintos enfoques algorítmicos.",
    steps: ["Problema", "Estructura de datos", "Algoritmo", "Solución"],
  },
  "quadratic-voting-dao": {
    label: "Más votos, un coste cuadrático mayor",
    category: "Contratos inteligentes · Gobernanza",
    summary:
      "Un sistema de gobernanza on-chain que explora la votación cuadrática mediante contratos en Solidity y tokens ERC-20.",
    metricLabels: [],
    problem:
      "¿Cómo puede la gobernanza basada en tokens expresar la intensidad de una preferencia mientras aumenta el coste de los votos adicionales? La votación cuadrática ofrece un mecanismo para explorar este equilibrio mediante software.",
    approach:
      "Implementé votación cuadrática on-chain con Solidity y tokens ERC-20. Los contratos aplican un coste cuadrático en tokens para determinar la asignación de votos en el sistema de gobernanza.",
    contribution:
      "Desarrollo del proyecto Quadratic Voting DAO, implementando el mecanismo de votación mediante contratos inteligentes y gobernanza basada en tokens. La implementación completa está disponible en el repositorio.",
    learnings:
      "Aprendí a expresar reglas de gobernanza y restricciones económicas en contratos inteligentes, y practiqué el desarrollo de una implementación desde el diseño hasta su finalización.",
    steps: [
      "Tokens del usuario",
      "Coste cuadrático · v²",
      "Asignación de votos",
      "Contrato inteligente",
    ],
  },
  "wheel-of-fortune": {
    label: "Multijugador, desde el socket",
    category: "Proyecto de software previo · Java",
    summary:
      "Juego de escritorio multijugador en Java con arquitectura host/cliente, comunicación en red e interfaz gráfica.",
    metricLabels: [],
    problem:
      "Un juego multijugador necesita coordinar el estado, unas reglas claras y una interfaz que responda entre jugadores conectados. Reúne el diseño de software y la comunicación en red en una misma aplicación.",
    approach:
      "Juego de escritorio en Java con Swing y arquitectura host/cliente mediante sockets. Incluye lógica de juego, jugadores controlados por IA, guardado y carga, y funcionalidad de deshacer, con diseño de software y UML.",
    contribution:
      "Participación en este proyecto colaborativo de Ingeniería del Software, adquiriendo experiencia con Java, diseño orientado a objetos y desarrollo de aplicaciones en red.",
    learnings:
      "Aprendí a separar la interfaz, la lógica de juego y la comunicación en red, y a convertir un diseño de software en una aplicación multijugador funcional.",
    steps: [
      "Cliente del jugador",
      "Conexión por sockets",
      "Host del juego",
      "Otros jugadores",
    ],
  },
};

export const spanishEducation = [
  {
    institution: "Universidad Complutense de Madrid",
    degree: "Grado en Ingeniería del Software",
    detail:
      "Mi grado principal. La mayor parte de las asignaturas se cursan en inglés: paradigmas de programación, algoritmos, estructuras de datos, bases de datos, arquitectura de software, desarrollo de aplicaciones y blockchain.",
  },
  {
    institution: "UDIMA",
    degree: "Grado en Empresa y Tecnología",
    detail:
      "Lo curso junto con Ingeniería del Software. Incluye fundamentos de empresa, gestión e innovación digital, y el uso de la tecnología en productos y organizaciones.",
  },
  {
    institution: "CEU Claudio Coello",
    degree: "Bachillerato Tecnológico",
    detail:
      "Formación centrada en matemáticas, física, economía y razonamiento analítico.",
  },
  {
    institution: "Academica International Studies",
    degree: "Diploma Dual de Bachillerato de EE. UU.",
    detail:
      "Completado junto con la educación española, íntegramente en inglés. Honor Roll Certificate por excelencia académica.",
  },
];

export const spanishExperience = [
  {
    role: "Representante de marca",
    detail:
      "Trabajo simultáneo a los estudios universitarios en hostelería y atención al cliente de lujo, representando a Louis Vuitton, Tiffany & Co. y Prada. Atención a clientes internacionales en español e inglés.",
  },
  {
    role: "Profesor de robótica y programación",
    detail:
      "Enseñé robótica y programación a estudiantes de primaria y secundaria en español e inglés, haciendo accesibles las ideas técnicas para distintas edades.",
  },
];

export const spanishQualities = [
  {
    title: "Asumir el camino crítico",
    text: "En HackMeridian me encargué de la parte más difícil, el circuito ZK y el contrato inteligente, e integré el trabajo de un equipo de cinco en una demo funcional.",
  },
  {
    title: "Seguir la evidencia",
    text: "La Abuelita nos enseñó a cuestionar el cuello de botella. Una mejor información de mercado importaba más que responder más rápido.",
  },
  {
    title: "Explicar con claridad",
    text: "Enseñar programación, defender pitches ante jurados y trabajar con clientes internacionales me han enseñado a explicar ideas a públicos muy distintos.",
  },
  {
    title: "Aprender con proyectos",
    text: "Desde algoritmos en C++ hasta pruebas de conocimiento cero, aprendo construyendo, investigando sistemas desconocidos y trabajando en los detalles.",
  },
  {
    title: "Mantener la calma",
    text: "Los plazos de los hackathons y la atención al cliente en entornos exigentes me han enseñado a tomar decisiones con calma bajo presión.",
  },
];
