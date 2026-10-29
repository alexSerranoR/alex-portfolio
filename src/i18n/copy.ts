import type { Locale } from "./routes";

const en = {
  nav: {
    prologue: "Prologue",
    chapters: "Projects",
    diary: "Diary",
    about: "About",
    contact: "Contact",
    library: "Library",
    libraryLabel: "Back to the library",
    label: "Main navigation",
    open: "Open navigation",
    close: "Close navigation",
    language: "Site language",
    skip: "Skip to content",
  },
  book: {
    edition: "English edition",
    running: "Alex Serrano · Portfolio",
  },
  title: {
    exLibris: "Ex libris",
    role: "Software Engineer",
    tagline: "Backend, AI, data and blockchain, built end to end.",
    location: "Madrid · Final-year student",
    read: "Start reading",
  },
  prologue: {
    heading: "Prologue",
    paragraphs: [
      "I’m Alejandro Serrano, Alex. I’m in the final year of Software Engineering at the Complutense University of Madrid, and I also study Business & Technology at UDIMA.",
      "I like building complete systems and seeing them through: from the first idea to something that works and can be shown. I enjoy taking on the hardest part, working in a team and explaining clearly what we have built. Hackathons, research and social impact projects have been my best school.",
      "This book collects those projects as chapters, each with the problem, what we built, my part and what I learned. I’m looking for my first software engineering internship, in backend, AI, data or blockchain.",
    ],
    signature: "Alex",
    cv: "Download CV",
  },
  index: {
    heading: "Contents",
    intro: "Every project is a full chapter, grouped by where it stands today.",
    filters: "Filter chapters",
    kinds: {
      all: "All",
      awarded: "Awarded",
      hackathon: "Hackathons",
      impact: "Social impact",
      research: "Research",
      engineering: "Engineering",
    },
    groups: {
      Ongoing: "In development",
      Completed: "Completed",
      Paused: "On hold",
    },
    chapters: "Chapters",
    empty: "No chapter matches these filters.",
    reset: "Show all chapters",
    appendices: "Appendices",
    latest: "From the diary",
  },
  work: {
    ongoing: "In development",
    completed: "Completed",
    paused: "On hold",
    technologies: "Tools",
    seals: "Distinctions",
  },
  chapter: {
    index: "Contents",
    repository: "Repository on GitHub",
    links: {
      demo: "Live demo",
      video: "Demo video",
      onchain: "Payment on Stellar testnet",
    },
    problem: "The problem",
    built: "What we built",
    building: "What we’re building",
    contribution: "My part",
    challenge: "The hard part",
    highlights: "What I built",
    learnings: "What I learned",
    ongoingLearnings: "What I’m learning",
    next: "What’s next",
    team: "Team",
    status: "Status",
    period: "Date",
    event: "Event",
    sources: "Sources",
    plate: "Plate",
    conceptual: "Conceptual diagram",
    teamDiagram: "Service architecture, from the team’s repository",
    previous: "Previous chapter",
    following: "Next chapter",
  },
  diary: {
    heading: "Diary",
    intro: "Short notes on where I am, what I’m building and where I’m going.",
    read: "Read the entry",
    back: "All entries",
    related: "Related chapter",
  },
  about: {
    heading: "About me",
    intro:
      "Final-year Software Engineering student in Madrid, also studying Business & Technology. Two degrees, seven years of formal education in English and a habit of learning by building.",
    qualities: "How I work",
    education: "Education",
    primary: "Primary degree",
    experience: "Experience while studying",
    experienceIntro:
      "Teaching taught me to explain technical ideas clearly, adapt to different audiences and take responsibility for a group.",
    toolkit: "Toolkit",
    toolkitCategories: [
      "Languages",
      "Software engineering",
      "Cloud & infrastructure",
      "Data, blockchain & web",
    ],
    languages: "Languages",
    languagesValue: "Spanish · Native / English · C1",
    beyond: "Outside engineering",
    sport:
      "Most of my time outside engineering goes into sport: football, running and strength training.",
  },
  contact: {
    heading: "Contact",
    intro:
      "Have an internship, an engineering role or a project in mind? I’d like to hear about it.",
    email: "Email",
    cvEn: "CV in English (PDF)",
    cvEs: "CV in Spanish (PDF)",
    github: "GitHub",
    linkedin: "LinkedIn",
    location: "Madrid, Spain",
  },
  footer: {
    colophon:
      "Set in Cormorant Garamond and EB Garamond. Written and built by Alex Serrano in Madrid.",
    top: "Back to top",
  },
  error: {
    label: "404",
    title: "This page isn’t in the book.",
    description: "Head back to the contents to keep reading.",
    back: "Back to contents",
  },
  seo: {
    title: "Alex Serrano | Software Engineer",
    description:
      "Final-year Software Engineering student in Madrid. Projects in zero-knowledge proofs, smart contracts, AI agents, data and cloud.",
    person: "Final-year Software Engineering student in Madrid.",
    social: "Projects in ZK proofs, smart contracts, AI, data and cloud.",
  },
  diagrams: {
    phonendo: {
      aria: "Sensor readings stay private; only a zero-knowledge proof reaches the Stellar contract, which pays the patient in USDC",
      private: "Stays private",
      public: "On-chain",
      caption: "The data stays. The proof travels.",
    },
    algas: {
      aria: "Sargassum is collected, dried, gasified and turned into electricity; the engine heat dries the next load",
      heat: "Engine heat",
      caption: "The engine’s heat dries the next load.",
    },
    mapping: {
      aria: "Conceptual graph connecting decentralized organizations through shared governance relationships",
      caption: "Data → Relationships → Network",
    },
    agents: {
      aria: "Buyer and seller agents negotiate with information flowing through shared market intelligence",
      caption: "Market data informs agent negotiations.",
    },
    embarca: {
      aria: "A company need becomes an AI-drafted challenge that students solve remotely, earning a stamp in their talent passport",
      caption: "AI prepares. A person reviews.",
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
      votes: "votes",
      tokens: "tokens",
      caption: "Votes² = token cost",
    },
    wheel: {
      aria: "Socket connections synchronize a game host with multiplayer clients",
      host: "Game host",
      client: "Client",
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
  nav: {
    prologue: "Prólogo",
    chapters: "Proyectos",
    diary: "Diario",
    about: "Sobre mí",
    contact: "Contacto",
    library: "Biblioteca",
    libraryLabel: "Volver a la biblioteca",
    label: "Navegación principal",
    open: "Abrir navegación",
    close: "Cerrar navegación",
    language: "Idioma del sitio",
    skip: "Saltar al contenido",
  },
  book: {
    edition: "Edición en español",
    running: "Alex Serrano · Portfolio",
  },
  title: {
    exLibris: "Ex libris",
    role: "Ingeniero de software",
    tagline: "Backend, IA, datos y blockchain, de principio a fin.",
    location: "Madrid · Último curso",
    read: "Empezar a leer",
  },
  prologue: {
    heading: "Prólogo",
    paragraphs: [
      "Soy Alejandro Serrano, Alex. Estoy en el último curso de Ingeniería del Software en la Universidad Complutense de Madrid y, en paralelo, estudio Empresa y Tecnología en UDIMA.",
      "Me gusta construir sistemas completos y llevarlos hasta el final: de la primera idea a algo que funciona y se puede enseñar. Disfruto encargándome de la parte más difícil, trabajando en equipo y explicando con claridad lo que hemos construido. Los hackathons, la investigación y los proyectos de impacto social han sido mi mejor escuela.",
      "Este libro reúne esos proyectos como capítulos, cada uno con el problema, lo que construimos, mi parte y lo que aprendí. Busco mis primeras prácticas en ingeniería del software, en backend, IA, datos o blockchain.",
    ],
    signature: "Alex",
    cv: "Descargar CV",
  },
  index: {
    heading: "Índice",
    intro:
      "Cada proyecto es un capítulo completo, agrupado según en qué punto está hoy.",
    filters: "Filtrar capítulos",
    kinds: {
      all: "Todos",
      awarded: "Premiados",
      hackathon: "Hackathons",
      impact: "Impacto social",
      research: "Investigación",
      engineering: "Ingeniería",
    },
    groups: {
      Ongoing: "En desarrollo",
      Completed: "Terminados",
      Paused: "En pausa",
    },
    chapters: "Capítulos",
    empty: "Ningún capítulo coincide con estos filtros.",
    reset: "Ver todos los capítulos",
    appendices: "Apéndices",
    latest: "Del diario",
  },
  work: {
    ongoing: "En desarrollo",
    completed: "Terminado",
    paused: "En pausa",
    technologies: "Herramientas",
    seals: "Distinciones",
  },
  chapter: {
    index: "Índice",
    repository: "Repositorio en GitHub",
    links: {
      demo: "Demo en vivo",
      video: "Vídeo de la demo",
      onchain: "Pago en la testnet de Stellar",
    },
    problem: "El problema",
    built: "Lo que construimos",
    building: "Lo que estamos construyendo",
    contribution: "Mi parte",
    challenge: "Lo más difícil",
    highlights: "Lo que construí",
    learnings: "Lo que aprendí",
    ongoingLearnings: "Lo que estoy aprendiendo",
    next: "Lo siguiente",
    team: "Equipo",
    status: "Estado",
    period: "Fecha",
    event: "Evento",
    sources: "Fuentes",
    plate: "Lámina",
    conceptual: "Diagrama conceptual",
    teamDiagram: "Arquitectura de servicios, del repositorio del equipo",
    previous: "Capítulo anterior",
    following: "Capítulo siguiente",
  },
  diary: {
    heading: "Diario",
    intro: "Notas breves sobre dónde estoy, qué construyo y hacia dónde voy.",
    read: "Leer la entrada",
    back: "Todas las entradas",
    related: "Capítulo relacionado",
  },
  about: {
    heading: "Sobre mí",
    intro:
      "Estudiante de último curso de Ingeniería del Software en Madrid, también de Empresa y Tecnología. Dos grados, siete años de formación en inglés y la costumbre de aprender construyendo.",
    qualities: "Cómo trabajo",
    education: "Formación",
    primary: "Grado principal",
    experience: "Experiencia durante mis estudios",
    experienceIntro:
      "Enseñar me ayudó a explicar ideas técnicas con claridad, adaptarme a públicos distintos y hacerme responsable de un grupo.",
    toolkit: "Herramientas",
    toolkitCategories: [
      "Lenguajes",
      "Ingeniería del software",
      "Cloud e infraestructura",
      "Datos, blockchain y web",
    ],
    languages: "Idiomas",
    languagesValue: "Español · Nativo / Inglés · C1",
    beyond: "Fuera de la ingeniería",
    sport:
      "Fuera de la ingeniería, dedico gran parte de mi tiempo al deporte: fútbol, running y entrenamiento de fuerza.",
  },
  contact: {
    heading: "Contacto",
    intro:
      "¿Tienes unas prácticas, un puesto de ingeniería o un proyecto en mente? Me gustaría conocerlo.",
    email: "Correo",
    cvEn: "CV en inglés (PDF)",
    cvEs: "CV en español (PDF)",
    github: "GitHub",
    linkedin: "LinkedIn",
    location: "Madrid, España",
  },
  footer: {
    colophon:
      "Compuesto en Cormorant Garamond y EB Garamond. Escrito y construido por Alex Serrano en Madrid.",
    top: "Volver arriba",
  },
  error: {
    label: "404",
    title: "Esta página no está en el libro.",
    description: "Vuelve al índice para seguir leyendo.",
    back: "Volver al índice",
  },
  seo: {
    title: "Alex Serrano | Ingeniero de Software",
    description:
      "Estudiante de último curso de Ingeniería del Software en Madrid. Proyectos de pruebas de conocimiento cero, contratos inteligentes, agentes de IA, datos y cloud.",
    person: "Estudiante de último curso de Ingeniería del Software en Madrid.",
    social:
      "Proyectos de pruebas ZK, contratos inteligentes, IA, datos y cloud.",
  },
  diagrams: {
    phonendo: {
      aria: "Las lecturas del sensor se quedan privadas; solo una prueba de conocimiento cero llega al contrato de Stellar, que paga al paciente en USDC",
      private: "Se queda privado",
      public: "On-chain",
      caption: "Los datos se quedan. La prueba viaja.",
    },
    algas: {
      aria: "El sargazo se recoge, se seca, se gasifica y se convierte en electricidad; el calor del motor seca la siguiente carga",
      heat: "Calor del motor",
      caption: "El calor del motor seca la siguiente carga.",
    },
    mapping: {
      aria: "Grafo conceptual que conecta organizaciones descentralizadas mediante relaciones de gobernanza",
      caption: "Datos → Relaciones → Red",
    },
    agents: {
      aria: "Agentes compradores y vendedores negocian con información compartida sobre el mercado",
      caption: "Los agentes negocian con datos de mercado.",
    },
    embarca: {
      aria: "La necesidad de una empresa se convierte en un reto generado con IA que los estudiantes resuelven en remoto y que suma un sello a su pasaporte de talento",
      caption: "La IA prepara. Valora una persona.",
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
      votes: "votos",
      tokens: "tokens",
      caption: "Votos² = coste en tokens",
    },
    wheel: {
      aria: "Conexiones mediante sockets sincronizan el host del juego con los clientes",
      host: "Host del juego",
      client: "Cliente",
      caption: "Estado compartido. Jugadores conectados.",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };
