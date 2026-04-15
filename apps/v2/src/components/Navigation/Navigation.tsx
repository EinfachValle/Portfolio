"use client";

import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  Close,
  CodeOutlined,
  HomeOutlined,
  MailOutlined,
  Menu,
  PersonOutlined,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import i18n from "@/config/i18n";
import { TRANSITION } from "@/constants/animation";
import { TIMING } from "@/constants/api";
import { CSS_CLASS, ELEMENT_ID, EVENT, SECTION_ID } from "@/constants/elements";
import { NAV, SECTION, Z_INDEX } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAppSelector } from "@/store/store";

import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";

// ── Types ─────────────────────────────────────────────────────────────

interface NavItem {
  labelKey: string;
  sectionId: string;
  icon: React.ElementType;
}

interface NavBarProps {
  navVisible: boolean;
  reducedMotion: boolean;
  scrolled: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.home", sectionId: SECTION_ID.HERO, icon: HomeOutlined },
  { labelKey: "nav.about", sectionId: SECTION_ID.ABOUT, icon: PersonOutlined },
  {
    labelKey: "nav.projects",
    sectionId: SECTION_ID.PROJECTS,
    icon: CodeOutlined,
  },
  {
    labelKey: "nav.contact",
    sectionId: SECTION_ID.CONTACT,
    icon: MailOutlined,
  },
];

// ── Styled components ─────────────────────────────────────────────────

const NavBar = styled("nav", {
  shouldForwardProp: (prop) =>
    prop !== "navVisible" && prop !== "reducedMotion" && prop !== "scrolled",
})<NavBarProps>(({ theme, navVisible, reducedMotion, scrolled }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: NAV.HEIGHT,
  zIndex: Z_INDEX.NAVBAR,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `0 ${SECTION.PADDING_X}px`,
  [theme.breakpoints.down("sm")]: {
    padding: `0 ${SECTION.PADDING_X_MOBILE}px`,
  },
  background: scrolled
    ? alpha(theme.palette.background.default, 0.92)
    : "transparent",
  backdropFilter: scrolled ? `blur(${NAV.BACKDROP_BLUR}px)` : "none",
  WebkitBackdropFilter: scrolled ? `blur(${NAV.BACKDROP_BLUR}px)` : "none",
  borderBottom: scrolled
    ? `1px solid ${theme.palette.border.separator}`
    : "1px solid transparent",
  boxShadow:
    scrolled && theme.palette.mode === "light"
      ? `0 1px 3px ${alpha(theme.palette.text.primary, 0.04)}`
      : "none",
  opacity: navVisible || reducedMotion ? 1 : 0,
  transform:
    navVisible || reducedMotion ? "translateY(0)" : "translateY(-20px)",
  transition: reducedMotion
    ? "none"
    : `opacity 0.6s ease, transform 0.6s ease, background ${TRANSITION.MEDIUM}, border-color ${TRANSITION.MEDIUM}, backdrop-filter ${TRANSITION.MEDIUM}, box-shadow ${TRANSITION.MEDIUM}`,
}));

interface NavLinkProps {
  active: boolean;
}

const NavLink = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<NavLinkProps>(({ theme, active }) => {
  const gradient = `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`;

  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: FONT_FAMILY.SANS,
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "2px",
    padding: "8px 16px",
    borderRadius: 6,
    transition: `opacity ${TRANSITION.FAST}`,
    // Gradient text for active, muted for inactive
    ...(active
      ? {
          backgroundImage: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }
      : {
          color: theme.palette.text.muted,
        }),
    "&:hover": active
      ? {}
      : {
          backgroundImage: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
    // Icon inherits gradient via currentColor when not using background-clip
    "& .MuiSvgIcon-root": {
      fontSize: 16,
      ...(active
        ? { color: theme.palette.accent.primary }
        : { color: "inherit" }),
    },
    "&:hover .MuiSvgIcon-root": {
      color: theme.palette.accent.primary,
    },
  };
});

const LangButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: FONT_FAMILY.SANS,
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: "0.5px",
  color: theme.palette.text.muted,
  padding: "6px 12px",
  borderRadius: 6,
  transition: `color ${TRANSITION.FAST}`,
  "&:hover": {
    color: alpha(theme.palette.accent.primary, 0.7),
  },
}));

const MobileOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: Z_INDEX.MOBILE_OVERLAY,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 32,
  background: alpha(theme.palette.background.default, 0.96),
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
}));

const MobileNavLink = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: FONT_FAMILY.SANS,
  fontSize: 24,
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: "12px 32px",
  borderRadius: 8,
  transition: `color ${TRANSITION.FAST}`,
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
  const { isMobile } = useDeviceTypeDetection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMainPage = pathname === "/" || pathname === "";
  const [activeSection, setActiveSection] = useState<string>(
    isMainPage ? SECTION_ID.HERO : "",
  );
  const reducedMotion = useReducedMotion();

  // Slide-in animation — waits for loader to finish
  useEffect(() => {
    if (reducedMotion) return;

    function start() {
      const timer = setTimeout(
        () => setNavVisible(true),
        TIMING.NAV_APPEAR_DELAY,
      );
      return () => clearTimeout(timer);
    }

    const content = document.getElementById(ELEMENT_ID.APP_CONTENT);
    if (content?.classList.contains(CSS_CLASS.READY)) {
      const cleanup = start();
      return cleanup;
    }

    let cleanup: (() => void) | undefined;
    function onLoaderDone() {
      cleanup = start();
    }
    window.addEventListener(EVENT.LOADER_DONE, onLoaderDone);
    return () => {
      window.removeEventListener(EVENT.LOADER_DONE, onLoaderDone);
      cleanup?.();
    };
  }, [reducedMotion]);

  // Track scroll position for glass background
  useEffect(() => {
    const handleScroll = () =>
      setScrolled(window.scrollY > NAV.SCROLL_THRESHOLD);
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
      { rootMargin: NAV.OBSERVER_MARGIN },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Close mobile menu + reset active section on route change
  useEffect(() => {
    setMenuOpen(false);
    setActiveSection(isMainPage ? SECTION_ID.HERO : "");
  }, [pathname, isMainPage]);

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

  const handleNavClick = useCallback(
    (sectionId: string) => {
      setMenuOpen(false);

      // Hero → scroll to top without hash in URL
      if (sectionId === SECTION_ID.HERO) {
        if (isMainPage) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          router.push("/");
        }
        return;
      }

      if (isMainPage) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Sub-pages: navigate to home without pushing a hash to the URL.
        // Stash the target section so the home page can scroll after mount.
        try {
          sessionStorage.setItem("pendingSectionScroll", sectionId);
        } catch {
          // sessionStorage unavailable (SSR / private mode) — ignore.
        }
        router.push("/");
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
        <Link
          href="/"
          style={{ textDecoration: "none" }}
          aria-label={t("a11y.homepageLink")}
        >
          <Logo size={NAV.LOGO_SIZE} />
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.sectionId}
                  active={activeSection === item.sectionId}
                  onClick={() => handleNavClick(item.sectionId)}
                >
                  <Icon />
                  {t(item.labelKey)}
                </NavLink>
              );
            })}
          </Box>
        )}

        {/* Right controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LangButton
            data-testid="lang-button"
            onClick={handleLanguageToggle}
            aria-label={t("a11y.switchLanguage")}
          >
            {currentLang}
          </LangButton>

          <ThemeToggle />

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              data-testid="mobile-menu-btn"
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
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <MobileNavLink
                key={item.sectionId}
                onClick={() => handleNavClick(item.sectionId)}
              >
                <Icon sx={{ fontSize: 20, mr: 1 }} />
                {t(item.labelKey)}
              </MobileNavLink>
            );
          })}
        </MobileOverlay>
      )}
    </>
  );
}
