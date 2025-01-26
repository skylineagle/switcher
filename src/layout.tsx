import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { UserProfile } from "@/components/ui/user-profile";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-full p-6 pb-0">
        <div className="flex items-center justify-between shrink-0 mb-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Switcher Logo" className="h-16 w-16" />
            <h1 className="text-3xl font-bold">Switcher</h1>
          </div>

          <div className="flex items-center gap-5">
            <AnimatedThemeToggle />
            <UserProfile />
          </div>
        </div>
        <div className="flex-1 p-2 pb-0">{children}</div>
      </div>
    </div>
  );
}
