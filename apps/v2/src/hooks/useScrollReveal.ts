"use client";

import { useCallback, useRef, useState } from "react";

import { SCROLL_REVEAL_CONFIG } from "@/constants/animation";

import { useReducedMotion } from "./useReducedMotion";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal(options?: UseScrollRevealOptions): {
  ref: React.RefCallback<HTMLElement>;
  isRevealed: boolean;
} {
  const reducedMotion = useReducedMotion();
  const [isRevealed, setIsRevealed] = useState(reducedMotion);
  const hasRevealedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const threshold = options?.threshold ?? SCROLL_REVEAL_CONFIG.THRESHOLD;
  const rootMargin = options?.rootMargin ?? "0px";

  const ref: React.RefCallback<HTMLElement> = useCallback(
    (element) => {
      // Disconnect any previously attached observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!element || hasRevealedRef.current || reducedMotion) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && !hasRevealedRef.current) {
            hasRevealedRef.current = true;
            setIsRevealed(true);
            observer.disconnect();
          }
        },
        { threshold, rootMargin },
      );

      observerRef.current = observer;
      observer.observe(element);
    },
    [reducedMotion, threshold, rootMargin],
  );

  return { ref, isRevealed };
}
