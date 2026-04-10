"use client";

import { HERO_TIMING } from "@/constants/animation";

import { useReducedMotion } from "./useReducedMotion";

export interface CharRevealItem {
  char: string;
  delay: number; // in seconds, for CSS animation-delay
}

interface UseCharRevealOptions {
  staggerDelay?: number;
}

export function useCharReveal(
  text: string,
  enabled: boolean,
  options?: UseCharRevealOptions,
): CharRevealItem[] {
  const reducedMotion = useReducedMotion();
  const staggerDelay = options?.staggerDelay ?? HERO_TIMING.CHAR_REVEAL_STAGGER;

  const chars = Array.from(text);

  // If reduced motion, delay is irrelevant (chars render immediately)
  // Otherwise, convert ms stagger to seconds for CSS animation-delay
  return chars.map((char, index) => ({
    char,
    delay: reducedMotion ? 0 : (index * staggerDelay) / 1000,
  }));
}
