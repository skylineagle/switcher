import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { UserProfile } from "@/components/ui/user-profile";
import { ParticleBackground } from "./background";
import { TooltipProvider } from "./components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
  hideBackground?: boolean;
}

export function AppLayout({
  children,
  hideBackground = false,
}: AppLayoutProps) {
  return (
    <TooltipProvider>
      <div className="h-screen">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-12 py-4">
            {!hideBackground && <ParticleBackground particleCount={250} />}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Switcher Logo" className="h-16 w-16" />
              <h1 className="text-3xl font-bold">Switcher</h1>
            </div>

            <div className="flex items-center gap-5">
              <AnimatedThemeToggle />
              <UserProfile />
            </div>
          </div>

          <div className="flex-1 p-12">{children}</div>
        </div>
      </div>
      <Toaster position="top-center" closeButton />
    </TooltipProvider>
  );
}
