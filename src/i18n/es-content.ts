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
> & { metricLabels: string[] };

export const spanishProjects: Record<string, ProjectTranslation> = {
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
    title: "Construir en equipo",
    text: "Los proyectos colaborativos y un hackathon en equipo de tres han influido en cómo debatimos las decisiones y hacemos avanzar el trabajo.",
  },
  {
    title: "Seguir la evidencia",
    text: "La Abuelita nos enseñó a cuestionar el cuello de botella. Una mejor información de mercado importaba más que responder más rápido.",
  },
  {
    title: "Explicar con claridad",
    text: "Enseñar programación y trabajar con clientes internacionales me ha dado práctica para explicar ideas a públicos distintos.",
  },
  {
    title: "Aprender con proyectos",
    text: "Desde algoritmos en C++ hasta despliegues en AWS, aprendo construyendo, investigando sistemas desconocidos y trabajando en los detalles.",
  },
  {
    title: "Mantener la calma",
    text: "Los plazos de los hackathons y la atención al cliente en entornos exigentes me han enseñado a tomar decisiones con calma bajo presión.",
  },
];
