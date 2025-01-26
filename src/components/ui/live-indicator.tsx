import { Label } from "@radix-ui/react-label";
import type React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { Camera } from "@/types/types";

const sizeClasses = {
  small: "w-2 h-2",
  medium: "w-3 h-3",
  large: "w-4 h-4",
};

interface LiveIndicatorProps {
  size?: "small" | "medium" | "large";
  status: Omit<Camera["status"], "off">;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  size = "medium",
  status,
}) => {
  return (
    <Badge
      variant="default"
      className={cn(
        "space-x-2",
        status === "on"
          ? "bg-red-500 hover:bg-red-500"
          : "bg-yellow-500 hover:bg-yellow-500"
      )}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <div
          className={`absolute inset-0 bg-current rounded-full animate-ping`}
        ></div>
        <div
          className={`relative ${sizeClasses[size]} bg-current rounded-full`}
        ></div>
      </div>
      <Label className="text-sm">{status === "on" ? "Live" : "Waiting"}</Label>
    </Badge>
  );
};
