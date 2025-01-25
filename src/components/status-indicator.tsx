import { Badge } from "@/components/ui/badge";
import LiveIndicator from "./ui/live-indicator";

interface StatusIndicatorProps {
  status: boolean;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <Badge
      variant={status ? "secondary" : "outline"}
      className="min-w-16 items-center justify-center"
    >
      {status ? (
        <div className="flex items-center space-x-4">
          <LiveIndicator size="medium" />
        </div>
      ) : (
        "Off"
      )}
    </Badge>
  );
}
