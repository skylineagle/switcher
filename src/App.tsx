import { CamerasPage } from "@/components/pages/cameras";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/auth/login-form";
import { ProtectedRoute } from "./components/auth/protected-route";
import { ThemeProvider } from "./components/theme-provider";
import { AppLayout } from "./layout";
import type { AuthState } from "./services/auth";
import { useAuthStore } from "./services/auth";

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <AppLayout>
                      <LoginForm />
                    </AppLayout>
                  )
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CamerasPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-center" />
          </BrowserRouter>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
