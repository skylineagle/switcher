import { getDefaultModeConfig, modeConfig } from "@/components/camera/consts";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDeviceActions } from "@/hooks/use-device-actions";
import { useAuthStore } from "@/lib/auth";
import { getIsPermitted } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import {
  CamerasModeOptions,
  PermissionsAllowedOptions,
} from "@/types/db.types";
import { useQuery } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { motion } from "motion/react";
import { memo, useMemo } from "react";

export interface ModeSelectorProps {
  mode: CamerasModeOptions | string;
  automation: boolean;
  handleModeChange: (mode: CamerasModeOptions) => void;
  isLoading?: boolean;
  modelId: string;
}

export const ModeSelector = memo(
  ({
    mode,
    automation,
    handleModeChange,
    isLoading,
    modelId,
  }: ModeSelectorProps) => {
    const { user } = useAuthStore();
    const { data: isPermitted } = useQuery({
      queryKey: ["permissions", "mode_change", user?.id],
      queryFn: async () =>
        await getIsPermitted(
          "mode_change",
          (user?.level ?? "user") as PermissionsAllowedOptions
        ),
    });

    // Fetch available actions for this camera model
    const { data: deviceActions = [], isLoading: isLoadingActions } =
      useDeviceActions(modelId);

    // Create a map of available actions
    const availableActions = useMemo(() => {
      return deviceActions.map((action) => action.name);
    }, [deviceActions]);

    const currentMode =
      modeConfig?.[mode as CamerasModeOptions] || getDefaultModeConfig(mode);

    if (isLoadingActions) {
      return (
        <Select disabled value={mode}>
          <SelectTrigger className="w-40 opacity-70">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <span>Loading...</span>
            </div>
          </SelectTrigger>
        </Select>
      );
    }

    return (
      <Select
        value={mode}
        onValueChange={handleModeChange}
        disabled={isLoading || !isPermitted || availableActions.length === 0}
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
            <span className="truncate">{currentMode.label}</span>
          </motion.div>
        </SelectTrigger>

        <SelectContent className="w-44 border-none bg-popover/95 backdrop-blur-sm shadow-xl">
          {availableActions.map((actionName) => {
            const configKey = actionName as CamerasModeOptions;
            const config =
              modeConfig[configKey] || getDefaultModeConfig(actionName);

            const { label, color, bgColor, hoverColor, icon: Icon } = config;
            const isDisabled = actionName === "auto" && !automation;
            const isSelected = mode === actionName;

            return (
              <SelectItem
                value={actionName}
                disabled={isDisabled}
                className={cn(
                  "transition-all duration-200 rounded-md",
                  isSelected && bgColor,
                  !isSelected && hoverColor,
                  isDisabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex flex-row items-center cursor-pointer my-0.5 px-2 py-1.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 mr-2",
                      isSelected ? color : "text-muted-foreground",
                      !isSelected &&
                        actionName === CamerasModeOptions.offline &&
                        "group-hover:text-slate-500",
                      !isSelected &&
                        actionName === CamerasModeOptions.auto &&
                        "group-hover:text-blue-500",
                      !isSelected &&
                        actionName === CamerasModeOptions.live &&
                        "group-hover:text-green-500",
                      !isSelected &&
                        actionName !== CamerasModeOptions.offline &&
                        actionName !== CamerasModeOptions.auto &&
                        actionName !== CamerasModeOptions.live &&
                        "group-hover:text-purple-500"
                    )}
                  />
                  <Label
                    className={cn(
                      "font-medium transition-colors",
                      isSelected && color,
                      !isSelected && "group-hover:text-purple-500",
                      actionName === CamerasModeOptions.offline &&
                        "group-hover:text-slate-500",
                      actionName === CamerasModeOptions.auto &&
                        "group-hover:text-blue-500",
                      actionName === CamerasModeOptions.live &&
                        "group-hover:text-green-500"
                    )}
                  >
                    {label}
                  </Label>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }
);

ModeSelector.displayName = "ModeSelector";
