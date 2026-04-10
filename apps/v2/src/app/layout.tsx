import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "../components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Valentin Röhle — Full-Stack Developer",
    template: "%s — Valentin Röhle",
  },
  description:
    "Portfolio & Projects by Valentin Röhle. Full-Stack Developer specializing in accessible, performant web interfaces.",
  openGraph: {
    title: "Valentin Röhle — Full-Stack Developer",
    description: "Portfolio & Projects by Valentin Röhle",
    url: "https://valentin-roehle.de",
    siteName: "Valentin Röhle",
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentin Röhle — Full-Stack Developer",
    description: "Portfolio & Projects by Valentin Röhle",
  },
};

// ── Blocking script: theme + scroll reset ────────────────────────
const headScript = `
(function() {
  try {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    var t = localStorage.getItem('theme');
    if (t !== 'light') t = 'dark';
    var d = document.documentElement;
    d.dataset.theme = t;
    d.style.backgroundColor = t === 'dark' ? '#0a0a0f' : '#fafafa';
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
  background: #0a0a0f;
}
html[data-theme="light"] #v-loader {
  background: #fafafa;
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
  width: 72px;
  height: 72px;
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
    filter: drop-shadow(0 0 0px rgba(6,182,212,0))
            drop-shadow(0 0 0px rgba(99,102,241,0));
  }
  50% {
    filter: drop-shadow(0 0 18px rgba(6,182,212,0.25))
            drop-shadow(0 0 40px rgba(99,102,241,0.1));
  }
}

.loader-line {
  width: 52px;
  height: 2px;
  border-radius: 1px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
  opacity: 0;
  animation: lineIn 0.3s ease 0.5s forwards;
}
html[data-theme="light"] .loader-line {
  background: rgba(15,23,42,0.06);
}

.loader-line::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, rgba(99,102,241,0.6));
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
          if (loader) loader.remove();
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
        <div id="v-loader">
          <div className="loader-inner">
            <img
              src="/web-app-manifest-192x192.png"
              alt=""
              width={72}
              height={72}
            />
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
