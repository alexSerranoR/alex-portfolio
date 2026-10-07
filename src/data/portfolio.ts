export const profile = {
  name: "Alex Serrano",
  fullName: "Alejandro Serrano Ruibal",
  email: "alexserranoruibal@gmail.com",
  github: "https://github.com/alexSerranoR",
  linkedin: "https://linkedin.com/in/alejandro-serrano-ruibal-505a7a384",
  cv: {
    en: "/cv/CV_Alejandro_Serrano_Ruibal_EN.pdf",
    es: "/cv/CV_Alejandro_Serrano_Ruibal_ES.pdf",
  },
};

export type Project = {
  slug: string;
  name: string;
  label: string;
  status: "Ongoing" | "Completed";
  period: string;
  category: string;
  summary: string;
  repository: string;
  technologies: string[];
  metrics: { value: string; label: string }[];
  problem: string;
  approach: string;
  contribution: string;
  learnings: string;
  steps: string[];
};

export const projects: Project[] = [
  {
    slug: "la-abuelita",
    name: "La Abuelita",
    label: "Multi-agent negotiation system",
    status: "Completed",
    period: "October 2026",
    category: "48-hour hackathon · Team of 3",
    summary:
      "Autonomous agents that negotiate with market evidence and shared intelligence. Built in 48 hours.",
    repository: "https://github.com/Bellaposa/La-Abuelita-Hackathon",
    technologies: [
      "Python",
      "AI Agents",
      "Multi-Agent Systems",
      "LLMs",
      "Market Analysis",
      "Negotiation",
      "Testing",
      "Data Analysis",
    ],
    metrics: [
      { value: "48h", label: "build window" },
      { value: "289", label: "tests" },
      { value: "121", label: "commits" },
      { value: "~12.7K", label: "lines of Python" },
    ],
    problem:
      "How should autonomous agents negotiate when better decisions depend on an evolving market? During the Claude Code hackathon, the team found that faster responses alone did not solve the real bottleneck: agents needed better information.",
    approach:
      "We built a multi-agent system to negotiate with buyers and sellers, analyze market activity and share information. As we developed it, agents used market data and previous negotiations to adjust their decisions, relying on information shared across the system.",
    contribution:
      "Built collaboratively in a three-person team during a 48-hour hackathon. We iterated on negotiation behavior, market analysis and information sharing, adapting the system as we learned more about the market.",
    learnings:
      "We learned to identify what was limiting the system before optimizing it. Better market information mattered more than faster responses. Tests helped us check changes under a tight deadline.",
    steps: [
      "Buyer agents",
      "Negotiation engine",
      "Seller agents",
      "Shared market intelligence",
    ],
  },
  {
    slug: "mapping-blockchain-ecosystem",
    name: "Mapping Blockchain Ecosystem",
    label: "Finding relationships in governance data",
    status: "Ongoing",
    period: "2026–2027",
    category: "Final-year research · Software + Data",
    summary:
      "Reproducible pipelines and graph models that turn large, imperfect governance datasets into measurable relationships.",
    repository: "https://github.com/TFG-Catalyst/Mapping-Blockchain-Ecosystem",
    technologies: [
      "Python",
      "Pandas",
      "NetworkX",
      "Jupyter",
      "Data Engineering",
      "Graph Analysis",
      "Git",
      "GitHub",
    ],
    metrics: [
      { value: "85K+", label: "DAOs in dataset" },
      { value: "370K+", label: "proposals" },
      { value: "Millions", label: "of votes" },
    ],
    problem:
      "Governance activity is distributed across multiple DAO platforms. A large dataset is only useful if its inconsistencies can be understood and relationships can be defined in a meaningful, measurable way.",
    approach:
      "The team is exploring data from multiple governance platforms, building reproducible processing pipelines and constructing graph models. Relationships between decentralized organizations are defined and checked before drawing conclusions from the network.",
    contribution:
      "My work includes dataset exploration, large-dataset processing, pipeline development, defining measurable DAO relationships, graph construction, validation and sanity checks. I also document findings and technical decisions so that the analysis can be revisited and reproduced.",
    learnings:
      "I’m learning how data quality, relationship definitions and validation affect a graph model. Alongside building the pipeline, I document the assumptions behind the analysis.",
    steps: [
      "Governance datasets",
      "Processing & validation",
      "Relationship models",
      "Graph analysis",
    ],
  },
  {
    slug: "quadratic-voting-dao",
    name: "Quadratic Voting DAO",
    label: "More votes, quadratically higher cost",
    status: "Completed",
    period: "2025–2026",
    category: "Smart contracts · Governance",
    summary:
      "An on-chain governance system exploring quadratic voting through Solidity contracts and ERC-20 tokens.",
    repository: "https://github.com/alexSerranoR/quadratic-voting-dao",
    technologies: [
      "Solidity",
      "Ethereum",
      "ERC-20",
      "Smart Contracts",
      "Web3",
      "DAO Governance",
    ],
    metrics: [],
    problem:
      "How can token-based governance express preference strength while increasing the cost of additional votes? Quadratic voting offers a mechanism to explore this tradeoff through software.",
    approach:
      "I implemented quadratic voting on-chain with Solidity and ERC-20 tokens. The contracts use a quadratic token cost to determine how votes are allocated in the governance system.",
    contribution:
      "Developed the quadratic voting DAO project, implementing the voting mechanism through smart contracts and token-based governance. The completed implementation is available in the repository.",
    learnings:
      "I learned to express governance rules and economic constraints in smart contracts, and gained practice taking a contract implementation from design to completion.",
    steps: [
      "User tokens",
      "Quadratic cost · v²",
      "Vote allocation",
      "Smart contract",
    ],
  },
  {
    slug: "algorithmic-techniques",
    name: "Algorithmic Techniques",
    label: "Algorithms and data structures in C++",
    status: "Ongoing",
    period: "2026",
    category: "Core engineering · Algorithms",
    summary:
      "C++ implementations exploring graphs, dynamic programming, greedy strategies and data structures.",
    repository: "https://github.com/alexSerranoR/AlgorithmicsTechniquesSE",
    technologies: [
      "C++",
      "Algorithms",
      "Data Structures",
      "Dynamic Programming",
      "Graphs",
      "Problem Solving",
    ],
    metrics: [],
    problem:
      "Different problems call for different structures and strategies. Building those techniques directly is a way to understand how an algorithm works and when it is useful.",
    approach:
      "An evolving collection of C++ implementations covering graphs, dynamic programming, greedy algorithms, heaps, priority queues and algorithmic problem solving.",
    contribution:
      "Implementing and studying classic algorithms and data structures in C++, with a focus on the reasoning behind each solution.",
    learnings:
      "I’m learning to choose data representations, explain why a solution works and compare the tradeoffs between algorithmic approaches.",
    steps: ["Problem", "Data structure", "Algorithm", "Solution"],
  },
  {
    slug: "aws-cloud-devops-lab",
    name: "AWS Cloud & DevOps Lab",
    label: "From application to infrastructure",
    status: "Ongoing",
    period: "2026",
    category: "Cloud · Application delivery",
    summary:
      "Learning deployment workflows by running containerized applications on AWS.",
    repository: "https://github.com/alexSerranoR/aws-cloud-devops-lab",
    technologies: [
      "AWS",
      "Docker",
      "ECS",
      "ECR",
      "Python",
      "GitHub",
      "Cloud Computing",
      "DevOps",
    ],
    metrics: [],
    problem:
      "Writing an application is one part of delivering software. Packaging it, managing its container image and running it on cloud infrastructure require a different set of engineering decisions.",
    approach:
      "I’m building a lab to deploy containerized applications on AWS: packaging application code with Docker, storing images in ECR and running workloads on ECS.",
    contribution:
      "Building the lab to learn cloud infrastructure and DevOps workflows through practical deployment work, using Python, Docker, ECR and ECS.",
    learnings:
      "I’m learning how code becomes a running application and which responsibilities belong to the application, its container and the cloud services it uses.",
    steps: [
      "GitHub / Application",
      "Docker",
      "ECR",
      "ECS",
      "AWS infrastructure",
    ],
  },
  {
    slug: "wheel-of-fortune",
    name: "Wheel of Fortune",
    label: "Multiplayer, from the socket up",
    status: "Completed",
    period: "2024–2025",
    category: "Earlier software work · Java",
    summary:
      "A Java desktop multiplayer game with a host/client architecture, networking and a graphical interface.",
    repository: "https://github.com/SwEng-UCM/wheel-of-fortune",
    technologies: [
      "Java",
      "Swing",
      "Sockets",
      "Networking",
      "OOP",
      "Software Design",
      "UML",
    ],
    metrics: [],
    problem:
      "A multiplayer game needs coordinated state, clear rules and a responsive interface across connected players. It brings software design and networking into the same application.",
    approach:
      "A Java desktop game with Swing and socket-based host/client networking. Features include game logic, AI-controlled players, save/load and undo functionality, supported by software design and UML.",
    contribution:
      "Worked on this collaborative Software Engineering project, building experience with Java, object-oriented design and networked application development.",
    learnings:
      "I learned to separate the interface, game logic and networking, and to turn a software design into a working multiplayer application.",
    steps: ["Player client", "Socket connection", "Game host", "Other players"],
  },
];

export const education = [
  {
    institution: "Complutense University of Madrid",
    short: "UCM",
    degree: "BSc in Software Engineering",
    dates: "Sep 2023 – Jul 2027 (expected)",
    detail:
      "My primary degree. Most coursework completed in English, spanning programming paradigms, algorithms, data structures, databases, software architecture, application development and blockchain.",
    primary: true,
  },
  {
    institution: "UDIMA",
    short: "UDIMA",
    degree: "BSc in Business & Technology",
    dates: "Sep 2024 – Present",
    detail:
      "Studied alongside Software Engineering. Covers business fundamentals, management and digital innovation, including how technology is used in products and organizations.",
    primary: false,
  },
  {
    institution: "CEU Claudio Coello",
    short: "CEU",
    degree: "Technical High School",
    dates: "Sep 2021 – Jun 2023",
    detail:
      "Bachillerato Tecnológico, with a focus on mathematics, physics, economics and analytical reasoning.",
    primary: false,
  },
  {
    institution: "Academica International Studies",
    short: "AIS",
    degree: "Dual U.S. High School Diploma",
    dates: "Sep 2019 – Jul 2022",
    detail:
      "Completed alongside Spanish education, entirely in English. Honor Roll Certificate for academic excellence.",
    primary: false,
  },
];

export const experience = [
  {
    role: "Brand Representative",
    company: "Wilde & Partners",
    dates: "Jul 2024 – Feb 2026",
    detail:
      "Worked alongside university studies in hospitality and luxury customer experience, representing Louis Vuitton, Tiffany & Co. and Prada. Supported international clients in Spanish and English.",
  },
  {
    role: "Robotics & Programming Teacher",
    company: "Camp Tecnológico",
    dates: "Sep 2022 – Jun 2023",
    detail:
      "Taught robotics and programming to primary and secondary students in Spanish and English, making technical ideas accessible to different ages.",
  },
];

export const toolkit = [
  {
    title: "Core software engineering",
    items: [
      "C++",
      "Java",
      "Python",
      "C",
      "JavaScript",
      "SQL",
      "OOP",
      "Data Structures",
      "Algorithms",
      "UML",
      "Git",
      "GitHub",
      "Scrum",
    ],
  },
  { title: "Cloud & infrastructure", items: ["AWS", "Docker", "ECS", "ECR"] },
  {
    title: "Data",
    items: [
      "Pandas",
      "Jupyter",
      "NetworkX",
      "REST APIs",
      "MongoDB",
      "Relational Databases",
    ],
  },
  {
    title: "Blockchain",
    items: ["Solidity", "Ethereum", "ERC-20", "Smart Contracts"],
  },
  { title: "Web", items: ["HTML", "CSS", "JavaScript"] },
];

export const qualities = [
  {
    title: "Build together",
    text: "Collaborative projects and a three-person hackathon team have shaped how I discuss decisions and move work forward.",
  },
  {
    title: "Follow the evidence",
    text: "La Abuelita taught us to question the bottleneck. Better market information mattered more than faster responses.",
  },
  {
    title: "Make ideas clear",
    text: "Teaching programming and working with international clients have given me practice explaining ideas to different audiences.",
  },
  {
    title: "Learn through projects",
    text: "From C++ algorithms to AWS deployments, I learn by building, investigating unfamiliar systems and working through the details.",
  },
  {
    title: "Keep a steady pace",
    text: "Hackathon deadlines and demanding customer-facing work have taught me to make decisions calmly under pressure.",
  },
];
