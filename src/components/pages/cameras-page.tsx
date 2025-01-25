import { AutomationIndicator } from "@/components/automation-indicator";
import { ConfigurationEditor } from "@/components/configuration/configuration-editor";
import { DeleteCamera } from "@/components/delete-camera/delete-camera";
import { StatusIndicator } from "@/components/status-indicator";
import { StreamLink } from "@/components/stream-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pb } from "@/lib/pocketbase";
import { getCameras, updateCamera } from "@/services/cameras";
import { CamerasModeOptions, CamerasResponse } from "@/types/db.types";
import { UpdateCamera } from "@/types/types";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function CamerasPage() {
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
    <Card className="size-full">
      <CardHeader>
        <CardTitle>Cameras</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead className="w-[25%]">Mode</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
              <TableHead className="w-[20%]">Automation</TableHead>
              <TableHead className="w-[25%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras?.map((camera) => {
              return (
                <TableRow key={camera.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Label>{camera.name || "Unnamed Camera"}</Label>
                      <StreamLink camera={camera} />
                    </div>
                  </TableCell>
                  <TableCell>
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
                  <TableCell>
                    <StatusIndicator status={camera.status} />
                  </TableCell>
                  <TableCell>
                    <AutomationIndicator camera={camera} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ConfigurationEditor camera={camera} />
                      <DeleteCamera camera={camera} />
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
