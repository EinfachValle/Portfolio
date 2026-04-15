"use client";

import React, { memo } from "react";

import { Box, styled } from "@mui/material";

import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  height: "100%",
  width: "100%",
  padding: "0",
  gap: theme.spacing(2),
}));

const ErrorPage = ({ error: _error, reset: _reset }: ErrorPageProps) => {
  return (
    <RootContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
        }}
      >
        <Link href="/">Home</Link>
      </Box>
    </RootContainer>
  );
};

export default memo(ErrorPage);
