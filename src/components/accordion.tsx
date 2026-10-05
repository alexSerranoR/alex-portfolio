"use client";

import { useEffect, useRef } from "react";

// Native disclosure remains functional without JavaScript. Animate its measured
// height rather than guessing a max-height, so translated content fits exactly.
export function Accordion({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (preference.matches) {
        animation.current?.finish();
        ref.current
          ?.querySelector(".disclosure-content")
          ?.getAnimations()
          .forEach((item) => item.finish());
      }
    };
    preference.addEventListener("change", settle);
    return () => {
      animation.current?.cancel();
      preference.removeEventListener("change", settle);
    };
  }, []);
  return (
    <details ref={ref} className={`disclosure ${className}`}>
      <summary
        onClick={(event) => {
          const node = ref.current;
          if (!node) return;
          event.preventDefault();
          const start = node.getBoundingClientRect().height;
          const shouldClose = node.open && !closing.current;
          animation.current?.cancel();
          closing.current = shouldClose;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            node.open = !shouldClose;
            closing.current = false;
            node.style.overflow = "";
            return;
          }
          node.open = true;
          const summary = node.querySelector("summary")!;
          const content = node.querySelector<HTMLElement>(
            ".disclosure-content",
          )!;
          const end =
            summary.getBoundingClientRect().height +
            (shouldClose ? 0 : content.getBoundingClientRect().height);
          node.style.overflow = "hidden";
          const current = node.animate(
            [{ height: `${start}px` }, { height: `${end}px` }],
            {
              duration: 380,
              easing: "cubic-bezier(.22,1,.36,1)",
            },
          );
          animation.current = current;
          content.animate(
            shouldClose
              ? [
                  { opacity: 1, transform: "translateY(0)" },
                  { opacity: 0, transform: "translateY(-8px)" },
                ]
              : [
                  { opacity: 0, transform: "translateY(8px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
            { duration: 300, easing: "ease-out" },
          );
          current.onfinish = () => {
            node.open = !shouldClose;
            node.style.overflow = "";
            closing.current = false;
            animation.current = null;
          };
        }}
      >
        <span>{title}</span>
        <span className="disclosure-icon" aria-hidden="true">
          <i />
          <i />
        </span>
      </summary>
      <div className="disclosure-content">{children}</div>
    </details>
  );
}
