"use client";

import { useEffect, useRef, useState } from "react";

import { HERO_TIMING } from "@/constants/animation";
import { TIMING } from "@/constants/api";

import { useReducedMotion } from "./useReducedMotion";

interface UseTypewriterOptions {
  minSpeed?: number;
  maxSpeed?: number;
  startDelay?: number;
}

export function useTypewriter(
  text: string,
  enabled: boolean,
  options?: UseTypewriterOptions,
): {
  displayText: string;
  isTyping: boolean;
  showCursor: boolean;
} {
  const reducedMotion = useReducedMotion();

  const minSpeed = options?.minSpeed ?? HERO_TIMING.TYPEWRITER_MIN_SPEED;
  const maxSpeed = options?.maxSpeed ?? HERO_TIMING.TYPEWRITER_MAX_SPEED;
  const startDelay = options?.startDelay ?? 0;

  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  const hasStartedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!enabled || hasStartedRef.current) return;

    hasStartedRef.current = true;

    const startTyping = () => {
      setIsTyping(true);
      setShowCursor(true);

      let index = 0;

      const typeNextChar = () => {
        if (index < text.length) {
          const char = text[index];
          setDisplayText((prev) => prev + (char ?? ""));
          index++;
          const delay = Math.random() * (maxSpeed - minSpeed) + minSpeed;
          timeoutRef.current = setTimeout(typeNextChar, delay);
        } else {
          setIsTyping(false);
          // Keep cursor visible for a while after typing ends, then hide
          timeoutRef.current = setTimeout(() => {
            setShowCursor(false);
          }, TIMING.TYPEWRITER_CURSOR_HIDE);
        }
      };

      typeNextChar();
    };

    if (startDelay > 0) {
      timeoutRef.current = setTimeout(startTyping, startDelay);
    } else {
      startTyping();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, text]);

  if (reducedMotion) {
    return { displayText: text, isTyping: false, showCursor: false };
  }

  return { displayText, isTyping, showCursor };
}
