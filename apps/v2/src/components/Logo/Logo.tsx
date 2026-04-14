"use client";

import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="V"
      width={size}
      height={size}
      className={className}
      priority
      unoptimized
      style={{ display: "block" }}
    />
  );
}
