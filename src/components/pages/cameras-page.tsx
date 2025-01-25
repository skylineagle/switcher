import { Badge } from "@/components/ui/badge";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function CamerasPage() {
  const queryClient = useQueryClient();

  const { data: cameras, isLoading: isCamerasLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: getCameras,
  });

  const { mutate: updateCameraMutation } = useMutation({
    mutationFn: async (data: UpdateCamera) => {
      await updateCamera(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update camera: " + error.message);
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
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Configuration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras?.map((camera: CamerasResponse) => {
              return (
                <TableRow key={camera.id}>
                  <TableCell>{camera.name || "Unnamed Camera"}</TableCell>
                  <TableCell>{camera.source}</TableCell>
                  <TableCell>
                    <Select
                      value={camera.mode}
                      onValueChange={(value: CamerasModeOptions) => {
                        updateCameraMutation({
                          id: camera.id,
                          mode: value,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CamerasModeOptions).map((mode) => (
                          <SelectItem
                            key={mode}
                            value={mode}
                            disabled={mode === "auto" && !camera.configuration}
                          >
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={camera.status ? "default" : "secondary"}>
                      {camera.status ? "On" : "Off"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <pre className="text-xs">
                      {camera.configuration
                        ? JSON.stringify(camera.configuration, null, 2)
                        : "No configuration"}
                    </pre>
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
