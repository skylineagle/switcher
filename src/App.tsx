import { CamerasPage } from "@/components/pages/cameras-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AnimatedThemeToggle } from "./components/ui/animated-theme-toggle";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="h-screen w-screen">
          <div className="container mx-auto h-full p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Switcher Logo"
                  className="h-16 w-16"
                />
                <h1 className="text-3xl font-bold">Switcher</h1>
              </div>

              <div className="flex items-center gap-5">
                <AnimatedThemeToggle />
              </div>
            </div>
            <CamerasPage />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
