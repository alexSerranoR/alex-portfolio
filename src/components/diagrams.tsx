import type { CSSProperties } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
  Boxes,
  Database,
  GitBranch,
  Layers,
  Network,
  Server,
  Users,
} from "lucide-react";
import { dictionaries } from "@/i18n/copy";
import type { Locale } from "@/i18n/routes";

function stepStyle(index: number): CSSProperties {
  return { "--step-index": index } as CSSProperties;
}

export function ProjectDiagram({
  slug,
  locale = "en",
}: {
  slug: string;
  locale?: Locale;
}) {
  const t = dictionaries[locale].diagrams;
  if (slug === "mapping-blockchain-ecosystem")
    return (
      <div
        className="project-diagram graph-diagram"
        role="img"
        aria-label={t.mapping.aria}
      >
        <svg viewBox="0 0 600 300" aria-hidden="true">
          {[
            [80, 120, 160, 65],
            [80, 120, 175, 200],
            [160, 65, 290, 115],
            [175, 200, 290, 115],
            [175, 200, 290, 255],
            [290, 115, 395, 50],
            [290, 115, 430, 160],
            [290, 255, 430, 160],
            [430, 160, 525, 80],
            [430, 160, 535, 235],
            [395, 50, 525, 80],
            [290, 115, 290, 255],
            [160, 65, 220, 20],
            [175, 200, 90, 265],
            [430, 160, 395, 50],
          ].map(([x1, y1, x2, y2], index) => (
            <line
              className="graph-relationship"
              pathLength={1}
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              style={stepStyle(index)}
            />
          ))}
          {[
            [80, 120, 7],
            [160, 65, 9],
            [175, 200, 10],
            [290, 115, 17],
            [290, 255, 8],
            [395, 50, 9],
            [430, 160, 13],
            [525, 80, 7],
            [535, 235, 8],
            [220, 20, 5],
            [90, 265, 6],
          ].map(([x, y, r], index) => (
            <g key={index} className="graph-point" style={stepStyle(index)}>
              <circle className="graph-halo" cx={x} cy={y} r={r + 13} />
              <circle className="graph-node" cx={x} cy={y} r={r} />
            </g>
          ))}
        </svg>
        <p className="diagram-caption-text">{t.mapping.caption}</p>
      </div>
    );
  if (slug === "la-abuelita")
    return (
      <div
        className="project-diagram agent-diagram"
        role="img"
        aria-label={t.agents.aria}
      >
        <div className="agent-row">
          <div className="diagram-block agent-buyer">
            <Users size={30} />
            <span>{t.agents.buyer}</span>
          </div>
          <span className="connector">
            <ArrowLeftRight size={22} />
          </span>
          <div className="diagram-block accent-block agent-engine">
            <Network size={38} />
            <span>{t.agents.engine}</span>
          </div>
          <span className="connector">
            <ArrowLeftRight size={22} />
          </span>
          <div className="diagram-block agent-seller">
            <Users size={30} />
            <span>{t.agents.seller}</span>
          </div>
        </div>
        <div className="feedback-line">
          <span />
          <ArrowUpDown size={24} />
          <span />
        </div>
        <div className="intelligence-block">
          <Database size={24} />
          <span>{t.agents.intelligence}</span>
        </div>
        <p className="diagram-caption-text">{t.agents.caption}</p>
      </div>
    );
  if (slug === "quadratic-voting-dao")
    return (
      <div
        className="project-diagram voting-diagram"
        role="img"
        aria-label={t.voting.aria}
      >
        {[1, 2, 3].map((votes, index) => (
          <div key={votes} className="voting-equation" style={stepStyle(index)}>
            <span className="vote-count">
              {votes}
              <small>{votes === 1 ? t.voting.vote : t.voting.votes}</small>
            </span>
            <ArrowRight size={21} />
            <span className="vote-squares">
              {Array.from({ length: votes * votes }, (_, square) => (
                <i key={square} style={stepStyle(square)} />
              ))}
            </span>
            <span className="vote-cost">
              {votes * votes} {votes === 1 ? t.voting.token : t.voting.tokens}
            </span>
          </div>
        ))}
        <p className="diagram-caption-text">{t.voting.caption}</p>
      </div>
    );
  if (slug === "algorithmic-techniques") {
    const nodes = [
      [60, 150],
      [190, 65],
      [190, 235],
      [320, 150],
      [450, 65],
      [450, 235],
      [555, 150],
    ];
    return (
      <div
        className="project-diagram traversal-diagram"
        role="img"
        aria-label={t.algorithm.aria}
      >
        <svg viewBox="0 0 600 300" aria-hidden="true">
          {[
            [0, 1],
            [0, 2],
            [1, 3],
            [2, 3],
            [3, 4],
            [3, 5],
            [4, 6],
            [5, 6],
          ].map(([from, to], index) => (
            <line
              key={index}
              className="traversal-edge"
              pathLength={1}
              x1={nodes[from][0]}
              y1={nodes[from][1]}
              x2={nodes[to][0]}
              y2={nodes[to][1]}
              style={stepStyle(index)}
            />
          ))}
          {nodes.map(([x, y], index) => (
            <g key={index} className="traversal-node" style={stepStyle(index)}>
              <circle cx={x} cy={y} r={24} />
              <text x={x} y={y} dominantBaseline="central" textAnchor="middle">
                {index + 1}
              </text>
            </g>
          ))}
        </svg>
        <p className="diagram-caption-text">{t.algorithm.caption}</p>
      </div>
    );
  }
  if (slug === "wheel-of-fortune")
    return (
      <div
        className="project-diagram multiplayer-diagram"
        role="img"
        aria-label={t.wheel.aria}
      >
        <svg viewBox="0 0 600 330" aria-hidden="true">
          <path
            className="socket-path"
            pathLength={1}
            d="M110 65 Q185 65 300 165 M490 65 Q415 65 300 165 M110 270 Q185 270 300 165 M490 270 Q415 270 300 165"
          />
          <circle className="host-halo" cx={300} cy={165} r={62} />
          <circle className="host-node" cx={300} cy={165} r={45} />
          <text
            className="host-label"
            x={300}
            y={165}
            dominantBaseline="central"
            textAnchor="middle"
          >
            {t.wheel.host}
          </text>
          {[
            [110, 65],
            [490, 65],
            [110, 270],
            [490, 270],
          ].map(([x, y], index) => (
            <g className="client-node" style={stepStyle(index)} key={index}>
              <circle cx={x} cy={y} r={20} />
              <text x={x} y={y + 43} textAnchor="middle">
                {t.wheel.client}
              </text>
            </g>
          ))}
          <text className="socket-label" x={300} y={48} textAnchor="middle">
            {t.wheel.sockets}
          </text>
          <circle className="network-packet packet-one" r={4} />
          <circle className="network-packet packet-two" r={4} />
        </svg>
        <p className="diagram-caption-text">{t.wheel.caption}</p>
      </div>
    );
  const steps = [
    { label: "GitHub", icon: GitBranch },
    { label: "Docker", icon: Boxes },
    { label: "ECR", icon: Layers },
    { label: "ECS", icon: Server },
  ];
  return (
    <div
      className="project-diagram flow-diagram"
      role="img"
      aria-label={t.cloud.aria}
    >
      <div className="flow-steps">
        {steps.map(({ label, icon: Icon }, index) => (
          <div className="flow-step" key={label} style={stepStyle(index)}>
            <div>
              <Icon size={38} />
              <span>{label}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="flow-arrow" size={20} />
            )}
          </div>
        ))}
      </div>
      <p className="diagram-caption-text">{t.cloud.caption}</p>
    </div>
  );
}
