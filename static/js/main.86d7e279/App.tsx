import { Box, ChakraProvider } from "@chakra-ui/react";
import "@fontsource/poppins";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "@fontsource-variable/dm-sans";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./styles/index.css";

import Login from "./routes/Login";
import ForgotPassword from "./routes/ForgotPassword";
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";

import Layout from "./components/Layout/Layout";
import Fonts from "./components/Fonts";

import theme from "./theme";
import { ROUTES } from "./constants/routes";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./components/Layout/AuthLayout";
import { queryClient } from "./configs/reactQuery";

function App() {
  useEffect(() => {
    if (
      typeof chrome.runtime !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      try {
        chrome.runtime.connect({ name: "popup" });
      } catch (err) {
        console.error("[CONNECT ERROR]", err);
      }
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Fonts />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Box className="app">
            <Routes>
              <Route
                path={ROUTES.LOGIN}
                element={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                }
              />
              <Route
                path={ROUTES.HOME}
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={
                  <Layout>
                    <ForgotPassword />
                  </Layout>
                }
              />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            </Routes>
          </Box>
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
