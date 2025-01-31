import { AutomationIndicator } from "@/components/camera/automation-indicator";
import { CameraName } from "@/components/camera/camera-name";
import { StatusIndicator } from "@/components/camera/status-indicator";
import { ConfigurationEditor } from "@/components/configuration/configuration-editor";
import { DeleteCamera } from "@/components/delete-camera/delete-camera";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/services/auth";
import { updateCamera } from "@/services/cameras";
import { CamerasModeOptions } from "@/types/db.types";
import { CamerasResponse, UpdateCamera } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import { ModeSelector } from "./mode-selector";

interface CameraProps {
  camera: CamerasResponse;
}

export const CameraRow = memo(({ camera }: CameraProps) => {
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
      <TableCell className="w-[20%]">
        <CameraName
          nickname={camera.nickname}
          name={camera.configuration?.name || ""}
        />
      </TableCell>
      <TableCell className="w-[25%]">
        <ModeSelector
          mode={camera.mode}
          automation={Boolean(camera.automation)}
          handleModeChange={handleModeChange}
        />
      </TableCell>
      <TableCell className="w-[15%]">
        <StatusIndicator status={camera.status} />
      </TableCell>
      <TableCell className="w-[30%]">
        <AutomationIndicator camera={camera} />
      </TableCell>
      <TableCell>
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
