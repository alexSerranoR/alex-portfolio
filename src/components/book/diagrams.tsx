import type { CSSProperties } from "react";
import {
  Boxes,
  Building2,
  Cloud,
  Coins,
  FileCode2,
  Flame,
  GitBranch,
  GraduationCap,
  HeartPulse,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  Stamp,
  Sun,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import type { Locale } from "@/i18n/routes";
import { roman } from "@/lib/roman";

const order = (index: number) => ({ "--i": index }) as CSSProperties;

function Step({
  label,
  icon: Icon,
  index,
  accent = false,
}: {
  label: string;
  icon: LucideIcon;
  index: number;
  accent?: boolean;
}) {
  return (
    <li
      className={accent ? "flow-step accent" : "flow-step"}
      style={order(index)}
    >
      <span className="node" aria-hidden="true">
        <Icon size={28} strokeWidth={1.4} />
      </span>
      <span>
        <span className="numeral" aria-hidden="true">
          {roman(index + 1).toLowerCase()}.{" "}
        </span>
        {label}
      </span>
    </li>
  );
}

function Flow({ steps, icons }: { steps: string[]; icons: LucideIcon[] }) {
  return (
    <ol className="flow">
      {steps.map((label, index) => (
        <Step
          key={label}
          label={label}
          icon={icons[index]}
          index={index}
          accent={index === steps.length - 1}
        />
      ))}
    </ol>
  );
}

// Each project gets one "plate": a conceptual drawing in the book's ink, not a
// literal deployment diagram. Labels come from the localized project steps.
export function ProjectDiagram({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = dictionaries[locale].diagrams;
  const { slug, steps } = project;

  if (slug === "phonendo")
    return (
      <div role="img" aria-label={t.phonendo.aria}>
        <div className="flow-groups" aria-hidden="true">
          <div className="flow-group">
            <span className="small-caps">{t.phonendo.private}</span>
            <ol className="flow">
              <Step label={steps[0]} icon={HeartPulse} index={0} />
              <Step label={steps[1]} icon={ShieldCheck} index={1} />
            </ol>
          </div>
          <span className="flow-bridge" />
          <div className="flow-group public">
            <span className="small-caps">{t.phonendo.public}</span>
            <ol className="flow">
              <Step label={steps[2]} icon={FileCode2} index={2} />
              <Step label={steps[3]} icon={Coins} index={3} accent />
            </ol>
          </div>
        </div>
      </div>
    );

  if (slug === "algas")
    return (
      <div role="img" aria-label={t.algas.aria}>
        <div aria-hidden="true">
          <Flow steps={steps} icons={[Waves, Sun, Flame, Zap]} />
          <div className="flow-loop">
            <svg viewBox="0 0 800 70" className="diagram">
              <path
                className="accent draw"
                pathLength={1}
                d="M700 6 C700 52 640 58 500 58 L320 58 C200 58 300 58 300 14"
                style={order(4)}
              />
              <path className="accent" d="M292 22 L300 10 L308 22" />
              <text x="500" y="50" textAnchor="middle">
                {t.algas.heat}
              </text>
            </svg>
          </div>
          <p className="loop-note">
            ↺ {t.algas.heat} → {steps[1]}
          </p>
        </div>
      </div>
    );

  if (slug === "embarca")
    return (
      <div role="img" aria-label={t.embarca.aria}>
        <div aria-hidden="true">
          <Flow
            steps={steps}
            icons={[Building2, Sparkles, GraduationCap, Stamp]}
          />
        </div>
      </div>
    );

  if (slug === "aws-cloud-devops-lab")
    return (
      <div role="img" aria-label={t.cloud.aria}>
        <div aria-hidden="true">
          <Flow
            steps={steps}
            icons={[GitBranch, Boxes, Layers, Server, Cloud]}
          />
        </div>
      </div>
    );

  if (slug === "la-abuelita")
    return (
      <svg
        viewBox="0 0 640 260"
        className="diagram"
        role="img"
        aria-label={t.agents.aria}
      >
        {["M124 90 L230 90", "M410 90 L516 90", "M320 128 L320 176"].map(
          (d, i) => (
            <path
              key={d}
              d={d}
              className="ink draw"
              pathLength={1}
              style={order(i)}
            />
          ),
        )}
        {[
          [80, steps[0]],
          [560, steps[2]],
        ].map(([x, label], i) => (
          <g key={String(label)} className="appear" style={order(i)}>
            <circle cx={Number(x)} cy={90} r={42} className="wash" />
            {[-14, 0, 14].map((dx) => (
              <circle
                key={dx}
                cx={Number(x) + dx}
                cy={84}
                r={6}
                className="ink"
              />
            ))}
            <text x={Number(x)} y={160} textAnchor="middle" className="label">
              {label}
            </text>
          </g>
        ))}
        <g className="appear" style={order(1)}>
          <rect
            x={230}
            y={52}
            width={180}
            height={76}
            rx={10}
            className="wash-accent"
          />
          <text x={320} y={96} textAnchor="middle" className="label">
            {steps[1]}
          </text>
        </g>
        <g className="appear" style={order(3)}>
          <rect
            x={150}
            y={176}
            width={340}
            height={54}
            rx={27}
            className="wash"
          />
          <text x={320} y={208} textAnchor="middle" className="label">
            {steps[3]}
          </text>
        </g>
      </svg>
    );

  if (slug === "quadratic-voting-dao")
    return (
      <svg
        viewBox="0 0 640 240"
        className="diagram"
        role="img"
        aria-label={t.voting.aria}
      >
        {[1, 2, 3].map((votes, i) => {
          const x = 70 + i * 200;
          const cell = 22;
          const size = votes * cell;
          return (
            <g key={votes} className="appear" style={order(i)}>
              <text x={x + 33} y={40} textAnchor="middle" className="numeral">
                {votes} {t.voting.votes}
              </text>
              {Array.from({ length: votes * votes }, (_, k) => (
                <rect
                  key={k}
                  x={x + 33 - size / 2 + (k % votes) * cell}
                  y={70 + Math.floor(k / votes) * cell}
                  width={cell - 4}
                  height={cell - 4}
                  className={k === votes * votes - 1 ? "wash-accent" : "wash"}
                />
              ))}
              <text
                x={x + 33}
                y={70 + 3 * cell + 40}
                textAnchor="middle"
                className="label"
              >
                {votes * votes} {t.voting.tokens}
              </text>
            </g>
          );
        })}
      </svg>
    );

  if (slug === "wheel-of-fortune") {
    const clients = [
      [110, 60],
      [530, 60],
      [110, 200],
      [530, 200],
    ];
    return (
      <svg
        viewBox="0 0 640 260"
        className="diagram"
        role="img"
        aria-label={t.wheel.aria}
      >
        {clients.map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y} Q${(x + 320) / 2} ${y} 320 130`}
            className="ink draw"
            pathLength={1}
            style={order(i)}
          />
        ))}
        <g className="appear" style={order(0)}>
          <circle cx={320} cy={130} r={58} className="wash-accent" />
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k * Math.PI) / 4;
            return (
              <line
                key={k}
                x1={320}
                y1={130}
                x2={320 + Math.cos(a) * 40}
                y2={130 + Math.sin(a) * 40}
                className="accent"
              />
            );
          })}
          <circle cx={320} cy={130} r={40} className="accent" />
        </g>
        <text x={320} y={215} textAnchor="middle" className="label">
          {t.wheel.host}
        </text>
        {clients.map(([x, y], i) => (
          <g key={i} className="appear" style={order(i + 1)}>
            <circle cx={x} cy={y} r={20} className="wash" />
            <text
              x={x}
              y={y + (y < 130 ? -30 : 42)}
              textAnchor="middle"
              className="label-sm"
            >
              {t.wheel.client}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  if (slug === "algorithmic-techniques") {
    const nodes = [
      [60, 130],
      [190, 55],
      [190, 205],
      [320, 130],
      [450, 55],
      [450, 205],
      [580, 130],
    ];
    const edges = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 6],
    ];
    return (
      <svg
        viewBox="0 0 640 260"
        className="diagram"
        role="img"
        aria-label={t.algorithm.aria}
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            className={i % 3 === 0 ? "accent draw" : "ink draw"}
            pathLength={1}
            style={order(i)}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i} className="appear" style={order(i)}>
            <circle
              cx={x}
              cy={y}
              r={22}
              className={i === 0 || i === 6 ? "wash-accent" : "wash"}
            />
            <text x={x} y={y + 7} textAnchor="middle" className="numeral">
              {roman(i + 1).toLowerCase()}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // Mapping Blockchain Ecosystem: organizations joined by governance relationships.
  const points = [
    [80, 120, 7],
    [160, 65, 9],
    [175, 200, 10],
    [290, 115, 17],
    [290, 230, 8],
    [395, 50, 9],
    [430, 160, 13],
    [525, 80, 7],
    [545, 215, 8],
    [220, 25, 5],
    [90, 235, 6],
  ];
  const links = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 6],
    [6, 7],
    [6, 8],
    [5, 7],
    [3, 4],
    [1, 9],
    [2, 10],
    [6, 5],
  ];
  return (
    <svg
      viewBox="0 0 640 260"
      className="diagram"
      role="img"
      aria-label={t.mapping.aria}
    >
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a][0]}
          y1={points[a][1]}
          x2={points[b][0]}
          y2={points[b][1]}
          className={a === 3 || b === 3 ? "accent draw" : "ink draw"}
          pathLength={1}
          style={order(i)}
        />
      ))}
      {points.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          className={i === 3 ? "wash-accent appear" : "wash appear"}
          style={order(i)}
        />
      ))}
    </svg>
  );
}

export function diagramCaption(slug: string, locale: Locale) {
  const t = dictionaries[locale].diagrams;
  const captions: Record<string, string> = {
    phonendo: t.phonendo.caption,
    algas: t.algas.caption,
    embarca: t.embarca.caption,
    "la-abuelita": t.agents.caption,
    "mapping-blockchain-ecosystem": t.mapping.caption,
    "quadratic-voting-dao": t.voting.caption,
    "aws-cloud-devops-lab": t.cloud.caption,
    "algorithmic-techniques": t.algorithm.caption,
    "wheel-of-fortune": t.wheel.caption,
  };
  return captions[slug];
}
