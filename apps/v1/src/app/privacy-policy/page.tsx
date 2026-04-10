"use client";

import { memo } from "react";

import { useTranslation } from "react-i18next";

import { Box, Typography, styled } from "@mui/material";

import { IMPRESSUM } from "@portfolio/shared";

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

const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  lineHeight: "1.7 !important",
  color: theme.palette.text.informationLight,
  textAlign: "left",
}));

const RightsList = styled("ul")(({ theme }) => ({
  margin: 0,
  paddingLeft: theme.spacing(3),
  listStyleType: "disc",
  textAlign: "left",
}));

const RightsListItem = styled("li")(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "1.7",
  color: theme.palette.text.informationLight,
  marginBottom: theme.spacing(0.5),
  textAlign: "left",
}));

const Datenschutz: React.FC = () => {
  const { t } = useTranslation();

  return (
    <RootContainer>
      <Header>
        <AnimatedLink withIcon={false} goBackIcon={true}>
          {t("info.name")}
        </AnimatedLink>
        <PageTitle>{t("datenschutz.title")}</PageTitle>
      </Header>

      <Section>
        <SectionHeading>{t("datenschutz.responsible.title")}</SectionHeading>
        <BodyText>{t("datenschutz.responsible.text")}</BodyText>
        <BodyText>{IMPRESSUM.fullName}</BodyText>
        <BodyText>{IMPRESSUM.address}</BodyText>
        <BodyText>{IMPRESSUM.city}</BodyText>
        <BodyText>
          {t("impressum.phone")}: {IMPRESSUM.phone}
        </BodyText>
        <BodyText>
          {t("impressum.email")}: {IMPRESSUM.email}
        </BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.general.title")}</SectionHeading>
        <BodyText>{t("datenschutz.general.text")}</BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.hosting.title")}</SectionHeading>
        <BodyText>{t("datenschutz.hosting.text")}</BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.analytics.title")}</SectionHeading>
        <BodyText>{t("datenschutz.analytics.text")}</BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.storage.title")}</SectionHeading>
        <BodyText>{t("datenschutz.storage.text")}</BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.fonts.title")}</SectionHeading>
        <BodyText>{t("datenschutz.fonts.text")}</BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.github.title")}</SectionHeading>
        <BodyText>{t("datenschutz.github.text")}</BodyText>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.rights.title")}</SectionHeading>
        <BodyText>{t("datenschutz.rights.text")}</BodyText>
        <RightsList>
          <RightsListItem>{t("datenschutz.rights.access")}</RightsListItem>
          <RightsListItem>
            {t("datenschutz.rights.rectification")}
          </RightsListItem>
          <RightsListItem>{t("datenschutz.rights.erasure")}</RightsListItem>
          <RightsListItem>{t("datenschutz.rights.restriction")}</RightsListItem>
          <RightsListItem>{t("datenschutz.rights.portability")}</RightsListItem>
          <RightsListItem>{t("datenschutz.rights.objection")}</RightsListItem>
        </RightsList>
      </Section>

      <Section>
        <SectionHeading>{t("datenschutz.complaint.title")}</SectionHeading>
        <BodyText>{t("datenschutz.complaint.text")}</BodyText>
      </Section>
    </RootContainer>
  );
};

export default memo(Datenschutz);
