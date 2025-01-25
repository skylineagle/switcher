import { Label } from "@radix-ui/react-label";
import type React from "react";

interface LiveIndicatorProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  size = "medium",
  color = "bg-red-500",
}) => {
  const sizeClasses = {
    small: "w-2 h-2",
    medium: "w-3 h-3",
    large: "w-4 h-4",
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <div
          className={`absolute inset-0 ${color} rounded-full animate-ping`}
        ></div>
        <div
          className={`relative ${sizeClasses[size]} ${color} rounded-full`}
        ></div>
      </div>
      <Label className="text-sm">Live</Label>
    </div>
  );
};

export default LiveIndicator;
