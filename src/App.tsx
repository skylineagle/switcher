import { CamerasPage } from "@/components/cameras";
import type { AuthState } from "@/lib/auth";
import { useAuthStore } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/auth/login-form";
import { ProtectedRoute } from "./components/auth/protected-route";
import { ThemeProvider } from "./components/theme-provider";
import { AppLayout } from "./layout";

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
