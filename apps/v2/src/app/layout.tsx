import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { JSON_LD_PERSON } from "@/constants/seo";

import Providers from "../components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://einfachvalle.de";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Valentin Röhle — Full-Stack Developer",
    template: "%s — Valentin Röhle",
  },
  description:
    "Portfolio & Projects by Valentin Röhle. Full-Stack Developer specializing in accessible, performant web interfaces.",
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Valentin Röhle — Full-Stack Developer",
    description: "Portfolio & Projects by Valentin Röhle",
    url: BASE_URL,
    siteName: "Valentin Röhle",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Valentin Röhle — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentin Röhle — Full-Stack Developer",
    description: "Portfolio & Projects by Valentin Röhle",
    images: ["/og-image.png"],
  },
};

// ── Blocking script: theme + scroll reset ────────────────────────
// Reads themeMode from redux-persist storage (persist:root → ui → themeMode)
// Falls back to "dark" if no persisted state exists
// Note: innerHTML below uses only static markup (no user input) — safe from XSS
const headScript = `
(function() {
  try {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    var t = 'dark';
    try {
      var root = JSON.parse(localStorage.getItem('persist:root') || '{}');
      var ui = JSON.parse(root.ui || '{}');
      if (ui.themeMode === 'light') t = 'light';
    } catch(e) {}
    var d = document.documentElement;
    d.dataset.theme = t;
    d.style.backgroundColor = 'var(--bg-primary)';
    d.style.colorScheme = t;
  } catch(e) {}
})();
`;

// ── Loader CSS ───────────────────────────────────────────────────
const loaderStyles = `
#v-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}
#v-loader.fade-out {
  animation: loaderFade 0.5s ease forwards;
}

.loader-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.loader-inner img {
  width: 120px;
  height: 120px;
  opacity: 0;
  transform: scale(0.8);
  animation: logoIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards,
             logoGlow 2s ease-in-out 0.7s infinite;
}

@keyframes logoIn {
  to { opacity: 1; transform: scale(1); }
}

@keyframes logoGlow {
  0%, 100% {
    filter: none;
  }
  50% {
    filter: drop-shadow(0 0 18px var(--loader-glow-1))
            drop-shadow(0 0 40px var(--loader-glow-2));
  }
}

.loader-line {
  width: 80px;
  height: 3px;
  border-radius: 1px;
  background: var(--text-muted);
  overflow: hidden;
  opacity: 0;
  animation: lineIn 0.3s ease 0.5s forwards;
}

.loader-line::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--loader-gradient-start), var(--loader-gradient-end));
  border-radius: 1px;
  transform: translateX(-100%);
  animation: lineProgress 2s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
}

@keyframes lineIn {
  to { opacity: 1; }
}

@keyframes lineProgress {
  to { transform: translateX(0); }
}

@keyframes loaderFade {
  to { opacity: 0; pointer-events: none; }
}

#app-content {
  opacity: 0;
}
#app-content.ready {
  animation: contentIn 0.5s ease forwards;
}
@keyframes contentIn {
  to { opacity: 1; }
}
`;

// ── Dismiss script ───────────────────────────────────────────────
const dismissScript = `
(function() {
  var ANIM_DURATION = 2800;
  var FALLBACK_MAX = 6000;
  var start = Date.now();
  var dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    var elapsed = Date.now() - start;
    var wait = Math.max(0, ANIM_DURATION - elapsed);

    setTimeout(function() {
      var loader = document.getElementById('v-loader');
      var content = document.getElementById('app-content');

      if (loader) loader.classList.add('fade-out');

      setTimeout(function() {
        if (content) content.classList.add('ready');
        window.dispatchEvent(new Event('loaderDone'));
        setTimeout(function() {
          if (loader) { loader.style.display = 'none'; }
        }, 600);
      }, 300);
    }, wait);
  }

  if (document.readyState === 'complete') { dismiss(); }
  else { window.addEventListener('load', dismiss); }
  setTimeout(dismiss, FALLBACK_MAX);
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <style dangerouslySetInnerHTML={{ __html: loaderStyles }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON_LD_PERSON),
          }}
        />
        <div id="v-loader" suppressHydrationWarning>
          <div className="loader-inner">
            <img src="/logo.png" alt="" width={120} height={120} />
            <div className="loader-line" />
          </div>
        </div>
        <div id="app-content">
          <Providers>{children}</Providers>
        </div>
        <script dangerouslySetInnerHTML={{ __html: dismissScript }} />
      </body>
    </html>
  );
}
