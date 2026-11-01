"use client";

import { useEffect, useRef } from "react";

// Content is fully visible without JavaScript and with reduced motion; the
// reveal only adds motion once the element scrolls into view.
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "figure" | "section" | "ul";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;
    node.classList.add("will-reveal");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    // @ts-expect-error The ref type matches every allowed tag.
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
