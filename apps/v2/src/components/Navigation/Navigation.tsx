"use client";

import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Close, Menu } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import i18n from "@/config/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAppSelector } from "@/store/store";

import { ThemeToggle } from "../ThemeToggle";

// ── Types ─────────────────────────────────────────────────────────────

interface NavItem {
  labelKey: string;
  sectionId: string;
}

interface NavBarProps {
  navVisible: boolean;
  reducedMotion: boolean;
  scrolled: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.home", sectionId: "hero" },
  { labelKey: "nav.about", sectionId: "about" },
  { labelKey: "nav.projects", sectionId: "projects" },
  { labelKey: "nav.contact", sectionId: "contact" },
];

const NAV_HEIGHT = 64;

// ── Styled components ─────────────────────────────────────────────────

const NavBar = styled("nav", {
  shouldForwardProp: (prop) =>
    prop !== "navVisible" && prop !== "reducedMotion" && prop !== "scrolled",
})<NavBarProps>(({ theme, navVisible, reducedMotion, scrolled }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: NAV_HEIGHT,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 40px",
  background: scrolled
    ? theme.palette.mode === "dark"
      ? "rgba(10, 10, 15, 0.6)"
      : "rgba(250, 250, 250, 0.6)"
    : "transparent",
  backdropFilter: scrolled ? "blur(12px)" : "none",
  WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
  borderBottom: scrolled
    ? theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.03)"
      : "1px solid rgba(15, 23, 42, 0.06)"
    : "1px solid transparent",
  opacity: navVisible || reducedMotion ? 1 : 0,
  transform:
    navVisible || reducedMotion ? "translateY(0)" : "translateY(-20px)",
  transition: reducedMotion
    ? "none"
    : "opacity 0.6s ease, transform 0.6s ease, background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
}));

interface NavLinkProps {
  active: boolean;
}

const NavLink = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<NavLinkProps>(({ theme, active }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontWeight: 400,
  color: active
    ? theme.palette.mode === "dark"
      ? "rgba(6, 182, 212, 0.7)"
      : "rgba(15, 23, 42, 0.8)"
    : theme.palette.mode === "dark"
      ? "rgba(148, 163, 184, 0.4)"
      : "rgba(15, 23, 42, 0.4)",
  padding: "8px 16px",
  borderRadius: 6,
  letterSpacing: "0.5px",
  transition: "color 0.2s ease",
  "&:hover": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(6, 182, 212, 0.7)"
        : "rgba(15, 23, 42, 0.8)",
  },
}));

const LangButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: "0.5px",
  color:
    theme.palette.mode === "dark"
      ? "rgba(148, 163, 184, 0.4)"
      : "rgba(15, 23, 42, 0.4)",
  padding: "6px 12px",
  borderRadius: 6,
  transition: "color 0.2s ease",
  "&:hover": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(6, 182, 212, 0.7)"
        : "rgba(15, 23, 42, 0.8)",
  },
}));

const MobileOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 32,
  background: theme.palette.glass.background,
  backdropFilter: `blur(${theme.palette.glass.blur * 2}px)`,
  WebkitBackdropFilter: `blur(${theme.palette.glass.blur * 2}px)`,
}));

const MobileNavLink = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  fontSize: 24,
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: "12px 32px",
  borderRadius: 8,
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.accent.primary,
  },
}));

// ── Component ─────────────────────────────────────────────────────────

export function Navigation() {
  const { t } = useTranslation();
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useAppSelector((state) => state.ui.locale);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const reducedMotion = useReducedMotion();

  // Slide-in animation — waits for loader to finish
  useEffect(() => {
    if (reducedMotion) return;

    function start() {
      const timer = setTimeout(() => setNavVisible(true), 300);
      return () => clearTimeout(timer);
    }

    const content = document.getElementById("app-content");
    if (content?.classList.contains("ready")) {
      const cleanup = start();
      return cleanup;
    }

    let cleanup: (() => void) | undefined;
    function onLoaderDone() {
      cleanup = start();
    }
    window.addEventListener("loaderDone", onLoaderDone);
    return () => {
      window.removeEventListener("loaderDone", onLoaderDone);
      cleanup?.();
    };
  }, [reducedMotion]);

  // Track scroll position for glass background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.sectionId);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isMainPage = pathname === "/" || pathname === "";

  const handleNavClick = useCallback(
    (sectionId: string) => {
      setMenuOpen(false);

      if (isMainPage) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/#${sectionId}`);
      }
    },
    [isMainPage, router],
  );

  const handleLanguageToggle = useCallback(() => {
    const current = i18n.language;
    i18n.changeLanguage(current === "en" ? "de" : "en");
  }, []);

  const rawLang = locale || i18n.language || "en";
  const currentLang = rawLang.substring(0, 2).toUpperCase();

  return (
    <>
      <NavBar
        navVisible={navVisible}
        reducedMotion={reducedMotion}
        scrolled={scrolled}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }} aria-label="Homepage">
          <Box
            component="img"
            src="/web-app-manifest-192x192.png"
            alt="V"
            sx={{
              width: 28,
              height: 28,
              display: "block",
            }}
          />
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.sectionId}
                active={activeSection === item.sectionId}
                onClick={() => handleNavClick(item.sectionId)}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </Box>
        )}

        {/* Right controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LangButton
            onClick={handleLanguageToggle}
            aria-label={t("a11y.switchLanguage")}
          >
            {currentLang}
          </LangButton>

          <ThemeToggle />

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
              sx={{ color: theme.palette.text.primary }}
            >
              {menuOpen ? <Close /> : <Menu />}
            </IconButton>
          )}
        </Box>
      </NavBar>

      {/* Mobile overlay menu */}
      {isMobile && menuOpen && (
        <MobileOverlay>
          {NAV_ITEMS.map((item) => (
            <MobileNavLink
              key={item.sectionId}
              onClick={() => handleNavClick(item.sectionId)}
            >
              {t(item.labelKey)}
            </MobileNavLink>
          ))}
        </MobileOverlay>
      )}
    </>
  );
}
