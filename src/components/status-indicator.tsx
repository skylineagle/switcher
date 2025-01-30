import { Badge } from "@/components/ui/badge";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { Camera } from "@/types/types";
import { memo } from "react";

interface StatusIndicatorProps {
  status: Camera["status"];
}

export const StatusIndicator = memo(({ status }: StatusIndicatorProps) => {
  return status === "on" ? (
    <LiveIndicator size="medium" status="on" />
  ) : status === "waiting" ? (
    <LiveIndicator size="medium" status="waiting" />
  ) : (
    <Badge variant="secondary" className="min-w-16 items-center justify-center">
      Off
    </Badge>
  );
});
