"use client";

import React, { useEffect, useRef } from "react";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

const MouseGlow: React.FC = () => {
  const { isMobile, isTablet } = useDeviceTypeDetection();
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    if (isMobile || isTablet) {
      glow.style.left = "auto";
      glow.style.right = "0px";
      glow.style.top = "auto";
      glow.style.bottom = "0px";
      glow.style.transform = "translate(25%, 25%)";
      return;
    }

    glow.style.right = "auto";
    glow.style.bottom = "auto";
    glow.style.transform = "translate(-50%, -50%)";
    glow.style.left = "-9999px";
    glow.style.top = "-9999px";

    const handleMouseMove = (e: MouseEvent): void => {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile, isTablet]);

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        width: "650px",
        height: "650px",
        borderRadius: "50%",
        background: "rgba(29, 78, 216, 0.15)",
        filter: "blur(100px)",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />
  );
};

export default MouseGlow;
