import { Badge } from "@/components/ui/badge";
import { Camera } from "@/types/types";
import LiveIndicator from "./ui/live-indicator";

interface StatusIndicatorProps {
  status: Camera["status"];
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return status === "on" ? (
    <LiveIndicator size="medium" status="on" />
  ) : status === "waiting" ? (
    <LiveIndicator size="medium" status="waiting" />
  ) : (
    <Badge variant="outline" className="min-w-16 items-center justify-center">
      Off
    </Badge>
  );
}
