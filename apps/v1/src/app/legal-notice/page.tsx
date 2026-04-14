"use client";

import { memo } from "react";

import { useTranslation } from "react-i18next";

import { Box, Typography, styled } from "@mui/material";

import {
  IMPRESSUM,
  formatAddressLine,
  formatCityLine,
} from "@portfolio/shared";

import AnimatedLink from "@/components/animated-link";

const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
  height: "100%",
  marginTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

const Header = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
  textAlign: "left",
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "700 !important",
  fontSize: "48px !important",
  lineHeight: "1",
  letterSpacing: "-1.2px",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(6),
}));

const Section = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "700px",
  marginBottom: theme.spacing(4),
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: "600 !important",
  fontSize: "20px !important",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1.5),
  textAlign: "left",
}));

const SubHeading = styled(Typography)(({ theme }) => ({
  fontWeight: "600 !important",
  fontSize: "16px !important",
  color: theme.palette.text.default,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  textAlign: "left",
}));

const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  lineHeight: "1.7 !important",
  color: theme.palette.text.informationLight,
  textAlign: "left",
}));

const Impressum: React.FC = () => {
  const { t } = useTranslation();

  return (
    <RootContainer>
      <Header>
        <AnimatedLink withIcon={false} goBackIcon={true}>
          {t("info.name")}
        </AnimatedLink>
        <PageTitle>{t("impressum.title")}</PageTitle>
      </Header>

      <Section>
        <SectionHeading>{t("impressum.according")}</SectionHeading>
        <BodyText>{IMPRESSUM.fullName}</BodyText>
        <BodyText>{formatAddressLine(IMPRESSUM)}</BodyText>
        <BodyText>{formatCityLine(IMPRESSUM)}</BodyText>
        {IMPRESSUM.country && <BodyText>{IMPRESSUM.country}</BodyText>}
      </Section>

      <Section>
        <SectionHeading>{t("impressum.contact")}</SectionHeading>
        <BodyText>
          {t("impressum.phone")}: {IMPRESSUM.phone}
        </BodyText>
        <BodyText>
          {t("impressum.email")}: {IMPRESSUM.email}
        </BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("impressum.liability.title")}</SectionHeading>

        <SubHeading>{t("impressum.liability.content")}</SubHeading>
        <BodyText>{t("impressum.liability.contentText")}</BodyText>

        <SubHeading>{t("impressum.liability.links")}</SubHeading>
        <BodyText>{t("impressum.liability.linksText")}</BodyText>

        <SubHeading>{t("impressum.liability.copyright")}</SubHeading>
        <BodyText>{t("impressum.liability.copyrightText")}</BodyText>
      </Section>
    </RootContainer>
  );
};

export default memo(Impressum);
