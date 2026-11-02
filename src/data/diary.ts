import type { Locale } from "@/i18n/routes";
import type { DiaryPhoto } from "./diary-photos";

type Localized<T> = Record<Locale, T>;

export type DiaryEntry = {
  slug: string;
  date: string;
  place: Localized<string>;
  title: Localized<string>;
  dek: Localized<string>;
  cover: { image: DiaryPhoto; alt: Localized<string> };
  // Paragraphs are plain text; a figure is placed after the paragraph index given.
  body: Localized<string[]>;
  // A closing line set large after the body, with a short coda under it.
  promise?: { line: Localized<string>; coda: Localized<string> };
  figure?: {
    after: number;
    image: DiaryPhoto;
    alt: Localized<string>;
    caption: Localized<string>;
  };
  related?: string;
};

export const diary: DiaryEntry[] = [
  {
    slug: "del-tajo-a-la-bahia",
    date: "2026-10-29",
    place: { en: "Lisbon", es: "Lisboa" },
    title: { en: "From the Tagus to the Bay", es: "Del Tajo a la Bahía" },
    dek: {
      en: "Lisbon, HackMeridian and a promise made in front of a red bridge.",
      es: "Lisboa, HackMeridian y una promesa hecha frente a un puente rojo.",
    },
    cover: {
      image: "selfie",
      alt: {
        en: "Alex on the Tagus riverfront in Lisbon, with the red 25 de Abril suspension bridge behind him",
        es: "Alex en la ribera del Tajo, en Lisboa, con el puente colgante rojo 25 de Abril detrás",
      },
    },
    body: {
      en: [
        "Some bridges look like a dress rehearsal. The 25 de Abril crosses the Tagus with the same red and almost the same silhouette as the Golden Gate, and that is no accident: it was built by American Bridge Company, the same firm behind San Francisco’s Bay Bridge.",
        "I went to Lisbon on a scholarship to compete at HackMeridian, the Stellar hackathon. In one weekend I led a team of five to build Phonendo: a sensor that proves a patient completed their cardiac rehab without revealing their health data, and a smart contract that verifies that proof and pays them automatically.",
        "I am in the last year of my degree and looking for my first internship. Backend, AI, data and blockchain all pull at me, and Lisbon confirmed something about how I work best: on hard problems, with short deadlines and people who care. I built against the clock, owned the hardest part of the system and came home sure I am on the right path.",
        "Standing in front of that bridge, I made myself a promise. The level, the curiosity and the drive that brought me here are only the starting point. This is Lisbon’s bridge.",
      ],
      es: [
        "Hay puentes que parecen un ensayo general. El 25 de Abril cruza el Tajo con el mismo rojo y casi la misma silueta que el Golden Gate, y no es casualidad: lo construyó American Bridge Company, la misma empresa que levantó el Bay Bridge de San Francisco.",
        "Fui a Lisboa con una beca para competir en HackMeridian, el hackathon de Stellar. En un fin de semana lideré a un equipo de cinco para construir Phonendo: un sensor que demuestra que un paciente ha completado su rehabilitación cardiaca sin revelar sus datos de salud, y un contrato inteligente que verifica esa prueba y le paga automáticamente.",
        "Estoy en el último año de carrera y buscando mis primeras prácticas. Me atraen el backend, la IA, los datos y blockchain, y Lisboa me confirmó algo sobre cómo trabajo mejor: en problemas difíciles, con plazos cortos y con gente que se implica. Construí contra reloj, me encargué de la parte más difícil del sistema y volví con la certeza de que voy por el camino correcto.",
        "Delante de ese puente me hice una promesa. El nivel, la curiosidad y las ganas que me han traído hasta aquí son solo el punto de partida. Este es el puente de Lisboa.",
      ],
    },
    promise: {
      line: {
        en: "The next one will be San Francisco’s.",
        es: "El siguiente será el de San Francisco.",
      },
      coda: {
        en: "I am writing it down here so that it comes true.",
        es: "Lo dejo escrito aquí para que se cumpla.",
      },
    },
    figure: {
      after: 2,
      image: "bridge",
      alt: {
        en: "The 25 de Abril bridge over the Tagus in Lisbon, with sailboats on the river under a clear blue sky",
        es: "El puente 25 de Abril sobre el Tajo, en Lisboa, con veleros en el río bajo un cielo azul despejado",
      },
      caption: {
        en: "The 25 de Abril bridge over the Tagus, Lisbon.",
        es: "El puente 25 de Abril sobre el Tajo, Lisboa.",
      },
    },
    related: "phonendo",
  },
];
