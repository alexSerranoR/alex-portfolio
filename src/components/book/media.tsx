"use client";

import { useEffect, useRef } from "react";

// A looping, silent screen recording. With reduced motion it stays on the
// poster frame; controls are shown so it can still be played on demand.
export function Reel({
  sources,
  poster,
  label,
}: {
  sources: { src: string; type: string }[];
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      video.controls = query.matches;
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return (
    <video
      ref={ref}
      className="reel"
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      width={960}
      height={540}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

type Twttr = { widgets?: { load: (node?: HTMLElement) => void } };

// The post is readable as a plain quote without JavaScript or if X is
// blocked; X's widget script upgrades it into the full embed when it loads.
export function PostEmbed({
  href,
  fallback,
  locale,
}: {
  href: string;
  fallback: string;
  locale: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const load = () =>
      (window as unknown as { twttr?: Twttr }).twttr?.widgets?.load(node);
    const existing = document.getElementById("x-widgets");
    if (existing) {
      load();
      return;
    }
    const script = document.createElement("script");
    script.id = "x-widgets";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.onload = load;
    document.body.appendChild(script);
  }, []);
  return (
    <div ref={ref} className="post-embed">
      <blockquote
        className="twitter-tweet"
        data-dnt="true"
        data-lang={locale}
        data-theme="light"
      >
        <a href={href}>{fallback}</a>
      </blockquote>
    </div>
  );
}
