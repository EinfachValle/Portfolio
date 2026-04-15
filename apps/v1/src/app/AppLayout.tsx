"use client";

import { Suspense, memo, useEffect } from "react";

import { useDispatch } from "react-redux";

import { Box, CircularProgress, styled } from "@mui/material";

import type { AppDispatch } from "@/store/store";

import MouseGlow from "../components/MouseGlow";
import SideMenu from "../components/SideMenu";
import { fetchGithubRepos } from "../store/actions/uiActions";
import { applicationScrollbar } from "../utils/stylingUtils";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  // minHeight: "100vh", // maybe a problem
  overflowY: "auto",
  overflowX: "hidden",
  gap: theme.spacing(1),
  background: theme.palette.surface.interface.base,
  color: theme.palette.text.default,
  zIndex: 999,
  ...applicationScrollbar(theme),
}));

const Content = styled(Box)(({ theme }) => ({
  margin: "0 auto",
  padding: theme.spacing(0, 5),
  width: "100%",
  maxWidth: "1280px",
}));

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchGithubRepos());
  }, [dispatch]);

  return (
    <Root>
      <MouseGlow />
      <SideMenu />
      <Content>
        <Suspense fallback={<CircularProgress style={{ margin: "auto" }} />}>
          {children}
        </Suspense>
      </Content>
    </Root>
  );
};

export default memo(AppLayout);
