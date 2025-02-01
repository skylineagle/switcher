import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/services/auth";
import { getIsPermitted } from "@/services/permissions";
import {
  CamerasModeOptions,
  PermissionsAllowedOptions,
} from "@/types/db.types";
import { useQuery } from "@tanstack/react-query";
import { Clock, Video, Ban } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

export interface ModeSelectorProps {
  mode: CamerasModeOptions;
  automation: boolean;
  handleModeChange: (mode: CamerasModeOptions) => void;
  isLoading?: boolean;
}

const modeConfig = {
  [CamerasModeOptions.live]: {
    label: "Live Stream",
    icon: Video,
    description: "Camera is actively streaming",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    hoverColor: "hover:bg-green-500/10",
  },
  [CamerasModeOptions.offline]: {
    label: "Offline",
    icon: Ban,
    description: "Camera is turned off",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    hoverColor: "hover:bg-slate-500/10",
  },
  [CamerasModeOptions.auto]: {
    label: "Automated",
    icon: Clock,
    description: "Camera follows automated schedule",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/10",
  },
} as const;

export const ModeSelector = memo(
  ({ mode, automation, handleModeChange, isLoading }: ModeSelectorProps) => {
    const currentMode = modeConfig[mode];
    const { user } = useAuthStore();
    const { data: isPermitted } = useQuery({
      queryKey: ["permissions", "mode_change", user?.id],
      queryFn: async () =>
        await getIsPermitted(
          "mode_change",
          (user?.level ?? "user") as PermissionsAllowedOptions
        ),
    });

    return (
      <Select
        value={mode}
        onValueChange={handleModeChange}
        disabled={isLoading || !isPermitted}
      >
        <SelectTrigger
          className={cn(
            "w-40 transition-all duration-300 ease-in-out border-1",
            currentMode.bgColor,
            "border-transparent",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Select camera mode"
        >
          <motion.div
            className="flex items-center gap-2"
            initial={false}
            animate={{ scale: isLoading ? 0.95 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={false}
              animate={{
                rotate: mode === "auto" ? 360 : 0,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 200,
              }}
            >
              <currentMode.icon className={cn("h-4 w-4", currentMode.color)} />
            </motion.div>
            <SelectValue />
          </motion.div>
        </SelectTrigger>

        <SelectContent className="w-44 border-none bg-popover/95 backdrop-blur-sm shadow-xl">
          {Object.values(CamerasModeOptions).map((modeOption) => {
            const { label, color, bgColor, hoverColor } =
              modeConfig[modeOption];
            const isDisabled = modeOption === "auto" && !automation;
            const isSelected = mode === modeOption;

            return (
              <motion.div
                key={modeOption}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SelectItem
                  value={modeOption}
                  disabled={isDisabled}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer group",
                    "transition-all duration-200 my-0.5 rounded-md",
                    isSelected && bgColor,
                    !isSelected && hoverColor,
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <Label
                    className={cn(
                      "font-medium transition-colors",
                      isSelected && color,
                      !isSelected && "group-hover:text-green-500",
                      modeOption === CamerasModeOptions.offline &&
                        "group-hover:text-slate-500",
                      modeOption === CamerasModeOptions.auto &&
                        "group-hover:text-blue-500"
                    )}
                  >
                    {label}
                  </Label>
                </SelectItem>
              </motion.div>
            );
          })}
        </SelectContent>
      </Select>
    );
  }
);

ModeSelector.displayName = "ModeSelector";
