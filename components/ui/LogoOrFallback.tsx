"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/asset-path";

type LogoOrFallbackProps = {
  logoPath?: string;
  logoUrl?: string;
  fallbackIcon: string;
  alt: string;
  className?: string;
};

export function LogoOrFallback({ logoPath, logoUrl, fallbackIcon, alt, className = "" }: LogoOrFallbackProps) {
  const source = logoPath ? withBasePath(logoPath) : logoUrl;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const showLogo = Boolean(source) && source !== failedSource;

  return (
    <span className={`company-logo-shell ${className}`.trim()}>
      {showLogo ? (
        // Dynamic and generated logo resources cannot use next/image without a fixed allowlist.
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} loading="lazy" referrerPolicy="no-referrer" src={source} onError={() => setFailedSource(source ?? null)} />
      ) : (
        <span className="company-fallback-badge" aria-label={`${alt} fallback`}>
          {fallbackIcon}
        </span>
      )}
    </span>
  );
}
