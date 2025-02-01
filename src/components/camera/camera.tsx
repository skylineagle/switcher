import { AutomationIndicator } from "@/components/camera/automation-indicator";
import { CameraName } from "@/components/camera/camera-name";
import { ModeSelector } from "@/components/camera/mode-selector";
import { StatusIndicator } from "@/components/camera/status-indicator";
import { ConfigurationEditor } from "@/components/configuration/configuration-editor";
import { DeleteCamera } from "@/components/delete-camera/delete-camera";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/services/auth";
import { updateCamera } from "@/services/cameras";
import { CamerasModeOptions } from "@/types/db.types";
import { CamerasResponse, UpdateCamera } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { toast } from "sonner";

interface CameraProps {
  camera: CamerasResponse;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

export const CameraRow = memo(function CameraRow({
  camera,
  isSelected,
  onSelect,
}: CameraProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { mutate: updateCameraModeMutation } = useMutation({
    mutationFn: async (data: UpdateCamera) => {
      await updateCamera(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera mode updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update camera mode: " + error.message);
    },
  });

  const handleModeChange = useCallback(
    (value: CamerasModeOptions) => {
      updateCameraModeMutation({
        id: camera.id,
        mode: value,
      });
    },
    [camera.id, updateCameraModeMutation]
  );

  return (
    <TableRow>
      <TableCell className="w-[50px] px-0">
        <div className="pl-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label={`Select ${
              camera.nickname || camera.configuration?.name
            }`}
          />
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        <CameraName
          nickname={camera.nickname}
          name={camera.configuration?.name || ""}
        />
      </TableCell>
      <TableCell className="w-[150px]">
        <ModeSelector
          mode={camera.mode}
          automation={Boolean(camera.automation)}
          handleModeChange={handleModeChange}
        />
      </TableCell>
      <TableCell className="w-[100px]">
        <StatusIndicator status={camera.status} />
      </TableCell>
      <TableCell className="w-[200px]">
        <AutomationIndicator camera={camera} />
      </TableCell>
      <TableCell className="w-[100px]">
        <div className="flex gap-2">
          <ConfigurationEditor camera={camera} />
          {user?.level === "manager" ||
            (user?.level === "super" && <DeleteCamera camera={camera} />)}
        </div>
      </TableCell>
    </TableRow>
  );
});

CameraRow.displayName = "CameraRow";
