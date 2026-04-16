"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { speak } from "@/lib/speech";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 w-9 text-base",
  md: "h-11 w-11 text-lg",
  lg: "h-14 w-14 text-2xl",
  xl: "h-20 w-20 text-4xl",
};

export function SpeakButton({
  text,
  rate,
  size = "md",
  tone = "orange",
  label,
}: {
  text: string;
  rate?: number;
  size?: Size;
  tone?: "orange" | "white";
  label?: string;
}) {
  const [active, setActive] = useState(false);

  const onClick = () => {
    speak(text, { rate });
    setActive(true);
    window.setTimeout(() => setActive(false), 500);
  };

  const colorClasses =
    tone === "white"
      ? "border-white/40 bg-white/20 text-white hover:bg-white/30"
      : "border-orange-300 bg-white text-orange-700 hover:shadow-md";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label ?? `השמיעי: ${text}`}
      whileTap={{ scale: 0.9 }}
      animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`grid flex-shrink-0 place-items-center rounded-xl border shadow-sm transition ${SIZE_CLASSES[size]} ${colorClasses}`}
    >
      🔊
    </motion.button>
  );
}
