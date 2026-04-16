"use client";

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = opts?.rate ?? 0.9;
  u.pitch = opts?.pitch ?? 1;
  synth.speak(u);
}

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}
