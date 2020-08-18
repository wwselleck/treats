import * as React from "react";
import { ThemeProvider } from "@chakra-ui/core";

import { Header } from "../Header";
import { Home } from "../Home";

export const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <Home />
    </ThemeProvider>
  );
};
