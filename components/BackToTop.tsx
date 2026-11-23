"use client";

import { useEffect, useState } from "react";

/* Shows only while the visitor is scrolling up, and hides again after a
   short pause, so it never sits on top of text being read. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      const y = window.scrollY;
      const goingUp = y < last - 4;
      const goingDown = y > last + 4;
      last = y;

      if (y <= 600) {
        setVisible(false);
        return;
      }
      if (goingUp) {
        setVisible(true);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setVisible(false), 2500);
      } else if (goingDown) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
