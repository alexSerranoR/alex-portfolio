"use client";

import { useEffect, useRef } from "react";
import "./spotlight-heading.css";

export function SpotlightHeading() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current!;
    const lines = Array.from(
      heading.querySelectorAll<HTMLElement>("[data-spotlight-text]"),
    );
    const desktop = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 761px)",
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let strength = 0;
    let targetStrength = 0;

    const animate = (time: number) => {
      frame = 0;
      const dt = previous ? Math.min(time - previous, 64) : 16;
      previous = time;
      const follow = 1 - Math.exp(-dt / 75);
      const fade = 1 - Math.exp(-dt / 120);
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      strength += (targetStrength - strength) * fade;
      if (targetStrength === 0 && strength < 0.002) strength = 0;
      heading.style.setProperty("--name-strength", String(strength));
      const rect = heading.getBoundingClientRect();
      const shiftX = Math.max(
        -2.5,
        Math.min(2.5, (x - rect.left - rect.width / 2) / 100),
      );
      const shiftY = Math.max(
        -2.5,
        Math.min(2.5, (y - rect.top - rect.height / 2) / 65),
      );
      heading.style.setProperty("--name-shift-x", `${shiftX * strength}px`);
      heading.style.setProperty("--name-shift-y", `${shiftY * strength}px`);
      lines.forEach((line) => {
        const bounds = line.getBoundingClientRect();
        // Convert viewport coordinates into the line's unscaled CSS coordinates.
        const scale = bounds.width / line.offsetWidth || 1;
        line.style.setProperty("--name-x", `${(x - bounds.left) / scale}px`);
        line.style.setProperty("--name-y", `${(y - bounds.top) / scale}px`);
      });
      if (strength || targetStrength) frame = requestAnimationFrame(animate);
      else previous = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => {
      targetStrength = 0;
      if (strength) schedule();
    };
    const move = (event: PointerEvent) => {
      if (!desktop.matches || reduced.matches || event.pointerType !== "mouse")
        return;
      const rect = heading.getBoundingClientRect();
      const distance = Math.hypot(
        Math.max(rect.left - event.clientX, 0, event.clientX - rect.right),
        Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom),
      );
      targetStrength = Math.max(0, 1 - distance / 60);
      targetX = event.clientX;
      targetY = event.clientY;
      if (!strength) {
        x = targetX;
        y = targetY;
      }
      if (strength || targetStrength) schedule();
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      strength = targetStrength = 0;
      heading.style.removeProperty("--name-strength");
      heading.style.removeProperty("--name-shift-x");
      heading.style.removeProperty("--name-shift-y");
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", leave, { passive: true });
    window.addEventListener("resize", reset);
    desktop.addEventListener("change", reset);
    reduced.addEventListener("change", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      reset();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", leave);
      window.removeEventListener("resize", reset);
      desktop.removeEventListener("change", reset);
      reduced.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  return (
    <h1 ref={ref} id="cover-name" className="spotlight-heading">
      <span data-spotlight-text="ALEX">
        ALEX
        <span className="name-reveal" aria-hidden="true">
          ALEX
        </span>
      </span>
      <span data-spotlight-text="SERRANO.">
        SERRANO<span className="cover-period">.</span>
        <span className="name-reveal" aria-hidden="true">
          SERRANO.
        </span>
      </span>
    </h1>
  );
}
