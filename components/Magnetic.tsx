"use client";

import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

export default function Magnetic({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent) => {
    const el = ref.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);

    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "translate(0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 200ms ease" }}
    >
      {children}
    </div>
  );
}
