import type { Locale } from "./routes";

const en = {
  cover: {
    navigation: "Explore the portfolio",
    scroll: "Scroll to explore",
    positioning: "Software Engineering at the core.",
  },
  nav: {
    projects: "Projects",
    education: "Education",
    about: "About",
    contact: "Contact",
    label: "Main navigation",
    open: "Open navigation",
    close: "Close navigation",
    language: "Site language",
    skip: "Skip to content",
  },
  hero: {
    location: "Madrid, Spain · Final-year student",
    role: ["Software", "Engineer"],
    tagline: ["Algorithms, backend and systems.", "Applied to my projects."],
    description:
      "I build projects in AI, cloud, data and blockchain, using what I study in algorithms, backend development and systems.",
    explore: "Explore my work",
    cv: "Download CV",
    cvEn: "Download English CV (EN)",
    cvEs: "Download Spanish CV (ES)",
    scroll: "Explore the projects",
    foundations: "Algorithms / Backend / Systems",
  },
  work: {
    label: "Projects",
    title: "What I’ve been building.",
    intro: "Projects in algorithms, AI, cloud, data and blockchain.",
    detail: "Explore case study",
    github: "GitHub",
    ongoing: "In progress",
    completed: "Completed",
    count: "of",
    technologies: "Technologies",
  },
  toolkit: {
    label: "Engineering toolkit",
    title: "Tools and fundamentals I use.",
    intro:
      "The tools and concepts I use to turn a problem into working software.",
    categories: [
      "Languages",
      "Software Engineering",
      "Cloud & Infrastructure",
      "Data, Blockchain & Web",
    ],
  },
  education: {
    label: "Education",
    title: "My studies.",
    intro:
      "Two degrees, with studies in Spain and a Dual U.S. High School Diploma.",
    university: "University studies",
    earlier: "Earlier education",
    primary: "Primary degree",
    languages: "Spanish · Native / English · C1",
    languageContext:
      "Seven years of formal education in English, including the Dual Diploma and much of my Software Engineering degree.",
  },
  about: {
    label: "About",
    title: "About Alex.",
    how: "How I work",
    intro:
      "I’m Alejandro, usually Alex. I’m a final-year Software Engineering student in Madrid, also studying Business & Technology.",
    description:
      "I like designing, building and improving software systems, then applying what I learn to areas I haven’t worked in before. I’m still exploring which areas to focus on. I want to understand how the software I build works and why.",
    beyond: "Outside engineering",
    sport:
      "Most of my time outside engineering goes into sport: football, running and strength training.",
    experience: "Experience while studying",
    experienceIntro:
      "Teaching and customer-facing work helped me communicate clearly, adapt to different people and take responsibility.",
  },
  contact: {
    label: "What’s next",
    title: ["Let’s build", "something"],
    description:
      "Have an engineering opportunity or a project in mind? I’d like to hear about it.",
    email: "Email Alex",
    location: "Madrid, Spain",
  },
  footer: {
    message: "Built by Alex. Learning as I go.",
    top: "Back to top",
  },
  case: {
    back: "All projects",
    repository: "View repository",
    architecture: "The system, at a glance",
    conceptual: "Conceptual architecture",
    problem: "The problem",
    approach: "The approach",
    building: "What we’re building",
    built: "What we built",
    contribution: "My contribution",
    learnings: "Key learnings",
    ongoingLearnings: "Learning in progress",
    source: "Explore the source on GitHub",
    next: "Next project",
    navigation: "Case study sections",
  },
  error: {
    label: "404",
    title: "This page isn’t here.",
    description: "Head back to the portfolio to explore the work.",
    back: "Back to portfolio",
  },
  seo: {
    title: "Alex Serrano | Software Engineer",
    description:
      "Software Engineering student in Madrid building projects across algorithms, AI, cloud, data and blockchain.",
    person: "Final-year Software Engineering student in Madrid.",
    social: "Projects in algorithms, AI, cloud, data and blockchain.",
  },
  system: {
    title: "Software Engineering",
    foundation: "The foundation",
    caption: "Algorithms, backend and systems across my projects.",
    nodes: [
      {
        title: "Algorithms",
        description:
          "The foundations: data structures, problem solving and algorithm design.",
      },
      {
        title: "Backend",
        description:
          "Building behavior, application logic and networked software.",
      },
      {
        title: "Systems",
        description: "Understanding how components connect and work together.",
      },
      {
        title: "AI",
        description:
          "Applying software engineering to agents and shared intelligence.",
      },
      {
        title: "Data",
        description:
          "Reproducible pipelines, measurable relationships and graph analysis.",
      },
      {
        title: "Cloud",
        description:
          "Taking applications from code to containerized infrastructure.",
      },
      {
        title: "Blockchain",
        description: "Exploring smart contracts and governance mechanisms.",
      },
    ],
  },
  diagrams: {
    mapping: {
      aria: "Conceptual graph connecting decentralized organizations through shared governance relationships",
      caption: "Data → Relationships → Network",
    },
    agents: {
      aria: "Buyer and seller agents negotiate with information flowing through shared market intelligence",
      buyer: "Buyer agents",
      seller: "Seller agents",
      engine: "Negotiation",
      intelligence: "Shared market intelligence",
      caption: "Market data informs agent negotiations.",
    },
    cloud: {
      aria: "Application delivery through GitHub, Docker, ECR and ECS on AWS",
      caption: "From application to AWS infrastructure",
    },
    algorithm: {
      aria: "A conceptual graph traversal connecting nodes one step at a time",
      caption: "Choose a structure. Follow a strategy.",
    },
    voting: {
      aria: "Quadratic voting: one, two and three votes cost one, four and nine tokens",
      vote: "vote",
      votes: "votes",
      token: "token",
      tokens: "tokens",
      caption: "Votes² = token cost",
    },
    wheel: {
      aria: "Socket connections synchronize a game host with multiplayer clients",
      host: "Game host",
      client: "Client",
      sockets: "Sockets",
      caption: "Shared game state. Connected players.",
    },
  },
};

type TranslationShape<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends string[]
      ? string[]
      : T[K] extends Array<infer U>
        ? TranslationShape<U>[]
        : T[K] extends object
          ? TranslationShape<T[K]>
          : T[K];
};
export type Dictionary = TranslationShape<typeof en>;

const es: Dictionary = {
  cover: {
    navigation: "Explorar el portfolio",
    scroll: "Desliza para explorar",
    positioning: "La ingeniería del software como base.",
  },
  nav: {
    projects: "Proyectos",
    education: "Formación",
    about: "Sobre mí",
    contact: "Contacto",
    label: "Navegación principal",
    open: "Abrir navegación",
    close: "Cerrar navegación",
    language: "Idioma del sitio",
    skip: "Saltar al contenido",
  },
  hero: {
    location: "Madrid, España · Último curso",
    role: ["Ingeniero", "de software"],
    tagline: ["Algoritmos, backend y sistemas.", "Aplicados a mis proyectos."],
    description:
      "Desarrollo proyectos de IA, cloud, datos y blockchain, con algoritmos, backend y sistemas como base.",
    explore: "Explorar proyectos",
    cv: "Descargar CV",
    cvEn: "Descargar CV en inglés (EN)",
    cvEs: "Descargar CV en español (ES)",
    scroll: "Explora los proyectos",
    foundations: "Algoritmos / Backend / Sistemas",
  },
  work: {
    label: "Proyectos",
    title: "Lo que estoy desarrollando.",
    intro: "Proyectos de algoritmos, IA, cloud, datos y blockchain.",
    detail: "Explorar el proyecto",
    github: "GitHub",
    ongoing: "En desarrollo",
    completed: "Completado",
    count: "de",
    technologies: "Tecnologías",
  },
  toolkit: {
    label: "Herramientas de ingeniería",
    title: "Herramientas y fundamentos que uso.",
    intro:
      "Las herramientas y los conceptos con los que convierto un problema en software funcional.",
    categories: [
      "Lenguajes",
      "Ingeniería del software",
      "Cloud e infraestructura",
      "Datos, blockchain y web",
    ],
  },
  education: {
    label: "Formación",
    title: "Mis estudios.",
    intro:
      "Dos grados, con estudios en España y un Diploma Dual de Bachillerato de EE. UU.",
    university: "Estudios universitarios",
    earlier: "Formación previa",
    primary: "Grado principal",
    languages: "Español · Nativo / Inglés · C1",
    languageContext:
      "Siete años de educación formal en inglés, incluidos el Diploma Dual y gran parte del grado en Ingeniería del Software.",
  },
  about: {
    label: "Sobre mí",
    title: "Sobre Alex.",
    how: "Cómo trabajo",
    intro:
      "Soy Alejandro, aunque suelo usar Alex. Estoy en el último curso de Ingeniería del Software en Madrid y también estudio Empresa y Tecnología.",
    description:
      "Me gusta diseñar, desarrollar y mejorar sistemas de software, y aplicar lo que aprendo a ámbitos en los que aún no he trabajado. Todavía estoy explorando en qué áreas centrarme. Quiero entender cómo funciona el software que construyo y por qué.",
    beyond: "Fuera de la ingeniería",
    sport:
      "Fuera de la ingeniería, dedico gran parte de mi tiempo al deporte: fútbol, running y entrenamiento de fuerza.",
    experience: "Experiencia durante mis estudios",
    experienceIntro:
      "La enseñanza y la atención al cliente me ayudaron a explicar ideas con claridad, adaptarme a distintas personas y asumir responsabilidades.",
  },
  contact: {
    label: "Lo próximo",
    title: ["Construyamos", "algo juntos"],
    description:
      "¿Tienes una oportunidad de ingeniería o un proyecto en mente? Me gustaría conocerlo.",
    email: "Escribir a Alex",
    location: "Madrid, España",
  },
  footer: {
    message: "Hecho por Alex. Aprendo con cada proyecto.",
    top: "Volver arriba",
  },
  case: {
    back: "Todos los proyectos",
    repository: "Ver repositorio",
    architecture: "El sistema, de un vistazo",
    conceptual: "Arquitectura conceptual",
    problem: "El problema",
    approach: "El enfoque",
    building: "Lo que estamos construyendo",
    built: "Lo que construimos",
    contribution: "Mi contribución",
    learnings: "Aprendizajes clave",
    ongoingLearnings: "Aprendizaje en curso",
    source: "Explorar el código en GitHub",
    next: "Siguiente proyecto",
    navigation: "Secciones del proyecto",
  },
  error: {
    label: "404",
    title: "Esta página no está aquí.",
    description: "Vuelve al portfolio para explorar los proyectos.",
    back: "Volver al portfolio",
  },
  seo: {
    title: "Alex Serrano | Ingeniero de Software",
    description:
      "Estudiante de Ingeniería del Software en Madrid con proyectos de algoritmos, IA, cloud, datos y blockchain.",
    person: "Estudiante de último curso de Ingeniería del Software en Madrid.",
    social: "Proyectos de algoritmos, IA, cloud, datos y blockchain.",
  },
  system: {
    title: "Ingeniería del Software",
    foundation: "La base",
    caption: "Algoritmos, backend y sistemas en mis proyectos.",
    nodes: [
      {
        title: "Algoritmos",
        description:
          "La base: estructuras de datos, resolución de problemas y diseño de algoritmos.",
      },
      {
        title: "Backend",
        description: "Desarrollo de lógica de aplicación y software conectado.",
      },
      {
        title: "Sistemas",
        description:
          "Entender cómo se conectan los componentes y trabajan juntos.",
      },
      {
        title: "IA",
        description:
          "Aplicar ingeniería del software a agentes e inteligencia compartida.",
      },
      {
        title: "Datos",
        description:
          "Pipelines reproducibles, relaciones medibles y análisis de grafos.",
      },
      {
        title: "Cloud",
        description:
          "Llevar aplicaciones del código a infraestructura con contenedores.",
      },
      {
        title: "Blockchain",
        description:
          "Explorar contratos inteligentes y mecanismos de gobernanza.",
      },
    ],
  },
  diagrams: {
    mapping: {
      aria: "Grafo conceptual que conecta organizaciones descentralizadas mediante relaciones de gobernanza",
      caption: "Datos → Relaciones → Red",
    },
    agents: {
      aria: "Agentes compradores y vendedores negocian con información compartida sobre el mercado",
      buyer: "Compradores",
      seller: "Vendedores",
      engine: "Negociación",
      intelligence: "Inteligencia de mercado compartida",
      caption: "Los agentes negocian con datos de mercado.",
    },
    cloud: {
      aria: "Despliegue de aplicaciones mediante GitHub, Docker, ECR y ECS en AWS",
      caption: "De la aplicación a la infraestructura en AWS",
    },
    algorithm: {
      aria: "Recorrido conceptual de un grafo que conecta nodos paso a paso",
      caption: "Elige una estructura. Sigue una estrategia.",
    },
    voting: {
      aria: "Votación cuadrática: uno, dos y tres votos cuestan uno, cuatro y nueve tokens",
      vote: "voto",
      votes: "votos",
      token: "token",
      tokens: "tokens",
      caption: "Votos² = coste en tokens",
    },
    wheel: {
      aria: "Conexiones mediante sockets sincronizan el host del juego con los clientes",
      host: "Host del juego",
      client: "Cliente",
      sockets: "Sockets",
      caption: "Estado compartido. Jugadores conectados.",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };
