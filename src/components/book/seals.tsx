import type { CSSProperties } from "react";
import { Award, GraduationCap, Mic, Trophy } from "lucide-react";
import type { Project, Seal } from "@/data/portfolio";

const tilts = ["-5deg", "4deg", "-2deg"];

function Emblem({ seal, size }: { seal: Seal; size: number }) {
  if (seal.kind === "second") return <span className="rank">2</span>;
  const Icon = {
    winner: Trophy,
    finalist: Award,
    grant: GraduationCap,
    pitch: Mic,
  }[seal.kind];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}

function waxTone(seal: Seal) {
  if (seal.kind === "second" || seal.kind === "winner") return "wax gold";
  if (seal.kind === "grant") return "wax green";
  return "wax";
}

// Awards are pressed into the page as wax seals, one per distinction.
export function Seals({
  project,
  label,
  small = false,
}: {
  project: Project;
  label: string;
  small?: boolean;
}) {
  const seals = project.event?.seals;
  if (!seals?.length) return null;
  if (small)
    return (
      <span className="toc-seals" aria-label={label} role="list">
        {seals.map((seal) => (
          <span key={seal.title} className="seal small" role="listitem">
            <span className={waxTone(seal)} aria-hidden="true">
              <Emblem seal={seal} size={13} />
            </span>
            <span className="sr-only">{seal.title}</span>
          </span>
        ))}
      </span>
    );
  return (
    <ul className="seals" aria-label={label}>
      {seals.map((seal, index) => (
        <li
          key={seal.title}
          className="seal"
          style={{ "--i": index, "--tilt": tilts[index % 3] } as CSSProperties}
        >
          <span className={waxTone(seal)} aria-hidden="true">
            <Emblem seal={seal} size={34} />
          </span>
          <span>{seal.title}</span>
        </li>
      ))}
    </ul>
  );
}
