import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { batchDeleteCameras, batchSetCameraMode } from "@/lib/cameras";
import { getIsPermitted } from "@/lib/permissions";
import {
  CamerasModeOptions,
  PermissionsAllowedOptions,
} from "@/types/db.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Clock, Power, PowerOff, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BatchOperationsProps {
  selectedCameras: string[];
  onClearSelection: () => void;
}

interface BatchOperationResult {
  succeeded: number;
  failed: number;
  total: number;
}

const modeConfig = {
  [CamerasModeOptions.live]: {
    color: "text-green-500",
  },
  [CamerasModeOptions.offline]: {
    color: "text-slate-500",
  },
  [CamerasModeOptions.auto]: {
    color: "text-blue-500",
  },
} as const;

export function BatchOperations({
  selectedCameras,
  onClearSelection,
}: BatchOperationsProps) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const { user } = useAuthStore();
  const { data: isPermittedToDelete } = useQuery({
    queryKey: ["permissions", "camera_delete", user?.id],
    queryFn: async () => {
      return getIsPermitted(
        "camera_delete",
        (user?.level ?? "user") as PermissionsAllowedOptions
      );
    },
  });
  const { data: isPermittedToChangeMode } = useQuery({
    queryKey: ["permissions", "mode_change", user?.id],
    queryFn: async () => {
      return getIsPermitted(
        "mode_change",
        (user?.level ?? "user") as PermissionsAllowedOptions
      );
    },
  });
  const { mutate: batchDelete, isPending: isDeleting } = useMutation<
    BatchOperationResult,
    Error,
    string[]
  >({
    mutationFn: async (ids: string[]) => {
      setProgress(0);
      return batchDeleteCameras(ids, (current, total) => {
        setProgress((current / total) * 100);
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success(
        `Successfully deleted ${result.succeeded} out of ${result.total} cameras`
      );
      if (result.failed > 0) {
        toast.error(`Failed to delete ${result.failed} cameras`);
      }
      onClearSelection();
      setProgress(0);
    },
  });

  const { mutate: batchSetMode, isPending: isUpdating } = useMutation<
    BatchOperationResult,
    Error,
    { ids: string[]; mode: CamerasModeOptions }
  >({
    mutationFn: async ({ ids, mode }) => {
      setProgress(0);
      return batchSetCameraMode(ids, mode, (current, total) => {
        setProgress((current / total) * 100);
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success(
        `Successfully updated ${result.succeeded} out of ${result.total} cameras`
      );
      if (result.failed > 0) {
        toast.error(`Failed to update ${result.failed} cameras`);
      }
      onClearSelection();
      setProgress(0);
    },
  });

  const isProcessing = isDeleting || isUpdating;

  if (selectedCameras.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">
          {selectedCameras.length} selected
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Batch Operations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isProcessing || !isPermittedToChangeMode}
              onClick={() =>
                batchSetMode({
                  ids: selectedCameras,
                  mode: CamerasModeOptions.live,
                })
              }
            >
              <Power
                className={cn(
                  "mr-2 h-4 w-4",
                  modeConfig[CamerasModeOptions.live].color
                )}
              />
              Set to Live Mode
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isProcessing || !isPermittedToChangeMode}
              onClick={() =>
                batchSetMode({
                  ids: selectedCameras,
                  mode: CamerasModeOptions.auto,
                })
              }
            >
              <Clock
                className={cn(
                  "mr-2 h-4 w-4",
                  modeConfig[CamerasModeOptions.auto].color
                )}
              />
              Set to Auto Mode
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isProcessing || !isPermittedToChangeMode}
              onClick={() =>
                batchSetMode({
                  ids: selectedCameras,
                  mode: CamerasModeOptions.offline,
                })
              }
            >
              <PowerOff
                className={cn(
                  "mr-2 h-4 w-4",
                  modeConfig[CamerasModeOptions.offline].color
                )}
              />
              Set to Offline Mode
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isProcessing || !isPermittedToDelete}
              className="text-destructive focus:text-destructive"
              onClick={() => batchDelete(selectedCameras)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isProcessing && (
        <div className="px-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Processing... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
