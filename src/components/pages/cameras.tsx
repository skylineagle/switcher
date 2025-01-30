import { AutomationIndicator } from "@/components/automation-indicator";
import { CameraName } from "@/components/camera-name";
import { ConfigurationEditor } from "@/components/configuration/configuration-editor";
import { DeleteCamera } from "@/components/delete-camera/delete-camera";
import { StatusIndicator } from "@/components/status-indicator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { pb } from "@/lib/pocketbase";
import { useAuthStore } from "@/services/auth";
import { getCameras, updateCamera } from "@/services/cameras";
import { CamerasModeOptions, CamerasResponse } from "@/types/db.types";
import { UpdateCamera } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function CamerasPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: cameras, isLoading: isCamerasLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: getCameras,
  });

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

  useEffect(() => {
    // Subscribe to realtime updates
    let unsubscribe: (() => void) | undefined;

    pb.collection("cameras")
      .subscribe("*", (e) => {
        // Update React Query cache with the new data
        queryClient.setQueryData<CamerasResponse[]>(["cameras"], (old) => {
          if (!old) return old;

          if (e.action === "create") {
            return [...old, e.record];
          }

          if (e.action === "delete") {
            return old.filter((camera) => camera.id !== e.record.id);
          }

          if (e.action === "update") {
            return old.map((camera) =>
              camera.id === e.record.id ? e.record : camera
            );
          }

          return old;
        });
      })
      .then((unsub) => {
        unsubscribe = unsub;
      });

    // Cleanup subscription on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [queryClient]);

  if (isCamerasLoading) return <div>Loading...</div>;

  return (
    <Card className="size-full shadow-2xl border-none">
      <CardHeader></CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {cameras?.map((camera) => {
              return (
                <TableRow key={camera.id}>
                  <TableCell className="w-[20%]">
                    <CameraName camera={camera} />
                  </TableCell>
                  <TableCell className="w-[25%]">
                    <Select
                      value={camera.mode}
                      onValueChange={(value: CamerasModeOptions) => {
                        updateCameraModeMutation({
                          id: camera.id,
                          mode: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-32">
                        {Object.values(CamerasModeOptions).map((mode) => (
                          <SelectItem
                            key={mode}
                            value={mode}
                            disabled={mode === "auto" && !camera.automation}
                          >
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <StatusIndicator status={camera.status} />
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <AutomationIndicator camera={camera} />
                  </TableCell>
                  <TableCell className="w-[35%]">
                    <div className="flex gap-2">
                      <ConfigurationEditor camera={camera} />
                      {user?.level === "manager" ||
                        (user?.level === "super" && (
                          <DeleteCamera camera={camera} />
                        ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
