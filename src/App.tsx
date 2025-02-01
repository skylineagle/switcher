import { CamerasPage } from "@/components/cameras";
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AppLayout hideBackground>
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
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
export default App;
