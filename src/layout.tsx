import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { UserProfile } from "@/components/ui/user-profile";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen">
      <div className="container mx-auto h-full p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Switcher Logo" className="h-16 w-16" />
            <h1 className="text-3xl font-bold">Switcher</h1>
          </div>

          <div className="flex items-center gap-5">
            <AnimatedThemeToggle />
            <UserProfile />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
